﻿using backend.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers
{
    [Route("api/")]
    [ApiController]
    [Authorize]
    public class TransactionController : Controller
    {
        private ITransactionRepository _transactionRepository;
        private IClientRepository _clientRepository;
        private IAccountRepository _accountRepository;
        private ICategoryRepository _categoryRepository;
      

        public TransactionController(ITransactionRepository transactionRepository, IClientRepository clientRepository, IAccountRepository accountRepository, ICategoryRepository categoryRepository)
        {
            _transactionRepository = transactionRepository;
            _clientRepository = clientRepository;
            _accountRepository = accountRepository;
            _categoryRepository = categoryRepository;
        }

        [HttpGet("clients/current/account/{id}/transactions")]
        [Authorize]

        public IActionResult Get(long id) 
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return StatusCode(403, "Unauthorized");
                }
                Client cl = _clientRepository.FindByEmail(email);
                if (cl == null)
                    return StatusCode(403, "Cliente no encontrado");

                Account account = cl.Accounts.FirstOrDefault(account => account.Id ==id);
                if (account == null)
                    return StatusCode(403, "Cuenta inexistente");

                var tran = new List<TransactionDTO>();
                foreach (var transaction in account.Transactions)
                {
                    var categoryid = transaction.CategoryId;
                    Category category = _categoryRepository.FindById(categoryid);
                    var newTransactionDTO = new TransactionDTO
                    {
                        Id = transaction.Id,
                        Amount = transaction.Amount,
                        Description = transaction.Description,
                        CreationDate = transaction.CreationDate,
                        Category=category.Id
                    };
                    tran.Add(newTransactionDTO);
                }
                return Ok(tran);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        //creo que no es necesario que se pase {accountId} porque desde el body ya tenemos el accountId
        [HttpPost("clients/current/transactions")]
        [Authorize]
        public IActionResult Post([FromBody] TransactionDTO transactionDTO)
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return StatusCode(403, "Unauthorized");
                }
                Client cl = _clientRepository.FindByEmail(email);
                if (cl == null)
                    return StatusCode(403, "Cliente no encontrado");

                Account account = cl.Accounts.FirstOrDefault(account => account.Id == transactionDTO.AccountId);
                if (account == null)
                    return StatusCode(403, "Cuenta inexistente");

 
                if (transactionDTO.Amount <= 0 || transactionDTO.Description == string.Empty) 
                    return StatusCode(403, "Datos invalidos");

                if (account.Balance < transactionDTO.Amount )
                    return StatusCode(403, "Fondos insuficientes para realizar la operacion");

                _transactionRepository.Save(new Transaction
                {  
                    Amount = transactionDTO.Amount * -1,
                    Description = transactionDTO.Description,
                    CreationDate = DateTime.Now,
                    AccountId = transactionDTO.AccountId,
                    PaymentMethodId = transactionDTO.PaymentMethodId,
                    CategoryId= transactionDTO.CategoryId
                });


                //Probar si account se actualiza cuando se guarda una transaccion que apunta a su ID
                //si no lo actualiza hay que agregar la transaccion que se acaba de guardar en el transactiones
                //del updatedaccount



                Account updatedAccount = new Account
                {
                    Id = account.Id,
                    Number = account.Number,
                    Description = account.Description,
                    Balance = account.Balance + transactionDTO.Amount * -1,
                    CreationDate = account.CreationDate,
                    ClientId = account.ClientId,
                };

                _accountRepository.Save(updatedAccount);

                //devolver dto con la transaction creada
                return Ok();
            
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("transactions/{id}")]
        [Authorize]
        public IActionResult DeleteTransaction(long id)
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (string.IsNullOrEmpty(email))
                {
                    return StatusCode(403, "Unauthorized");
                }
                Client client = _clientRepository.FindByEmail(email);
                if (client == null)
                    return StatusCode(403, "Cliente no encontrado");

                Transaction transactionToDelete = _transactionRepository.FindByNumber(id);

                if (transactionToDelete == null )
                    return NotFound();
                _transactionRepository.DeleteTransaction(transactionToDelete);

                Account updatedAccount = _accountRepository.FindById(transactionToDelete.AccountId);
                updatedAccount.Balance += transactionToDelete.Amount * -1;
                _accountRepository.Save(updatedAccount);

                return Ok(new { message = "Transaccion eliminada exitosamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
