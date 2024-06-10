﻿using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace backend.Models
{
    public static class PrepareDb
    {
        public static void Population(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetService<MyContext>();
                SeedData(context);
                DbInitializer.Initialize(context);
            }
        }

        public static void SeedData(MyContext context)
        {
            System.Console.WriteLine("Applying initial migration..."); //para informarnos desde la consola
            context.Database.Migrate();
            System.Console.WriteLine("Initial migration (database) done!");
        }
    }
}
