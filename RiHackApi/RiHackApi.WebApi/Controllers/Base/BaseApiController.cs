using Microsoft.AspNetCore.Mvc;

namespace RiHackApi.WebApi.Controllers.Base;

[ApiController]

#if DEBUG
[Route("api/[controller]")]
#else
[Route("[controller]")]
#endif

public class BaseApiController : ControllerBase { }