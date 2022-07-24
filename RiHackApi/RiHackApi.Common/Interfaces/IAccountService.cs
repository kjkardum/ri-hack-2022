using RiHackApi.Common.Requests;
using RiHackApi.Common.Responses;
using RiHackApi.Common.Wrappers;
using RiHackApi.Domain.Dtos;

namespace RiHackApi.Common.Interfaces;

public interface IAccountService
{
    Task<Response<LoginResponse>> Login(LoginRequest request);
    Task<Response<Guid>> RegisterUser(RegistrationRequest request);
    Task<Response<string>> ChangePassword(ChangePasswordRequest model);
    /*Task<Response<string>> ForgotPassword(ForgotPasswordRequest model, string origin);
    Task<Response<string>> ResetPassword(ResetPasswordRequest model);*/
    Task<bool> CheckEmailTaken(string email);
    
    Task SetAsAdmin(Guid userId);
    Task RevokeAdmin(Guid userId);

    Task<ICollection<UserDto>> GetAllUsers();
}