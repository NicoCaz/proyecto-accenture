﻿using backend.Enumerates;
using System.Diagnostics.Eventing.Reader;

namespace backend.DTOs
{
    public class TransactionDTO
    {
        public long Id { get; set; }
        public double Amount { get; set; }  
        public string Description { get; set; }
        public long Category { get; set; }
        public DateTime CreationDate { get; set; }
        public long AccountId { get; set; }
        public long CategoryId { get; set; }
        public long PaymentMethodId { get; set; }
     
    }
}
