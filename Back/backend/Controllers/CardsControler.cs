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
    public class CardsControler : ControllerBase
    {
        private ICardRepository _cardRepository;
        private IClientRepository _clientRepository;

        public CardsControler(ICardRepository CardRepository, IClientRepository ClientRepository)
        {
            _cardRepository = CardRepository;
            _clientRepository = ClientRepository;
        }
        [HttpGet("clients/current/cards")]
        public IActionResult Get()
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (email == string.Empty)
                {
                    return Forbid();
                }
                Client client = _clientRepository.FindByEmail(email);

                if (client == null)
                {
                    return Forbid();
                }
                var cardsDTO = new List<CardDTO>();
                foreach (Card card in client.Cards)
                {
                    var newCardDTO = new CardDTO()
                    {
                        Id = card.Id,
                        Type = card.Type,
                        Number = card.Number,
                        DeadLine=card.Deadline
                        //agregar info aca
                    };
                    cardsDTO.Add(newCardDTO);
                }
                return Ok(cardsDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("clients/current/cards")]
        public IActionResult Post([FromBody] Card card)
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (email == string.Empty)
                {
                    return Forbid();
                }
                Client client = _clientRepository.FindByEmail(email);
                if (client == null)
                {
                    return Forbid();
                }
                Card auxCard = _cardRepository.FindById(card.Id);
                if (auxCard == null)
                {
                    Card newCard = new Card()
                    {
                        ClientId = client.Id,
                        Type = card.Type,
                        Number = card.Number,
                        Deadline = card.Deadline,
                    };
                    _cardRepository.Save(newCard);
                    return Created("", newCard);
                }
                else
                {
                    auxCard.Type = card.Type;
                    auxCard.Number = card.Number;
                    auxCard.Deadline = card.Deadline;

                    _cardRepository.Save(auxCard);
                    return Ok(auxCard);
                }      
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpDelete("clients/current/cards/{id}")]
        public IActionResult Delete(long id)
        {
            try
            {
                var email = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;
                if (email == null)
                {
                    return Forbid();
                }
                Client client = _clientRepository.FindByEmail(email);
                if (client == null)
                {
                    return Forbid();
                }
                Card cardToDelete = _cardRepository.FindById(id);
                if (cardToDelete == null || cardToDelete.ClientId != client.Id)
                {
                    return NotFound();
                }
                _cardRepository.DeleteCard(cardToDelete); // Método para eliminar en el repositorio
                return Ok(new { message = "Tarjeta eliminada con éxito." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}

