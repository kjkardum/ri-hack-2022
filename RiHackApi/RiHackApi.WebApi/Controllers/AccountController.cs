using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RiHackApi.Common.Constants;
using RiHackApi.Common.Interfaces;
using RiHackApi.Common.Requests;
using RiHackApi.WebApi.Controllers.Base;

namespace RiHackApi.WebApi.Controllers;

public class AccountController : BaseApiController
{
    private readonly IAccountService _accountService;

    public AccountController(IAccountService accountService)
    {
        _accountService = accountService;
    }
    
    [HttpPost("Login")]
    public async Task<IActionResult> Authenticate(LoginRequest request)
    {
        var response = await _accountService.Login(request);
        return Ok(response);
    }
    
    [HttpPost("Register")]
    public async Task<IActionResult> Register(RegistrationRequest request)
    {
        return Ok(await _accountService.RegisterUser(request));
    }

    [HttpPost("ChangePassword")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        return Ok(await _accountService.ChangePassword(request));
    }
    
    [HttpPost("CheckEmailTaken")]
    public async Task<IActionResult> CheckEmailTaken(CheckEmailTakenRequest request)
    {
        return Ok(await _accountService.CheckEmailTaken(request.Email));
    }
}