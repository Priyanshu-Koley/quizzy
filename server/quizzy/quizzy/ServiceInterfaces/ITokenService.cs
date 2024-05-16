﻿using quizzy.Entities;

namespace quizzy.ServiceInterfaces
{
    public interface ITokenService
    {
        public Task<string> CreateToken(AppUser user);
    }
}
