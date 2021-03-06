# The RxStack Exceptions

> The Exception component contains a set of standard exception classes.
They set the correct HTTP status codes for REST calls and socket responses.

## Installation

```
npm install @rxstack/exceptions --save
```

## Documentation

* [Standard exceptions](#standard-exceptions)
* [Special exceptions](#special-exceptions)
* [Helpers](#helpers)

### <a name="standard-exceptions"></a>  Standard exceptions
The following exception types, all of which are instances of base `Exception` class are available:

- 400: BadRequest
- 401: Unauthorized
- 402: PaymentRequired
- 403: Forbidden
- 404: NotFound
- 405: MethodNotAllowed
- 406: NotAcceptable
- 407: ProxyAuthenticationRequired
- 408: RequestTimeout
- 409: Conflict
- 410: Gone
- 411: LengthRequired
- 412: PreconditionFailed
- 413: PayloadTooLarge
- 414: URITooLong
- 415: UnsupportedMediaType
- 416: Satisfiable
- 417: ExpectationFailed
- 422: UnprocessableEntity
- 429: TooManyRequests
- 451: UnavailableForLegalReasons
- 500: HttpException
- 501: NotImplemented
- 502: BadGateway
- 503: Unavailable
- 507: InsufficientStorage

Exceptions contain the following fields:

- name: The error name
- message: The error message
- stack: The error stack
- data: extra data
- statusCode: The HTTP status code

### <a name="special-exceptions"></a> Special exceptions
If you use `https://github.com/typestack/class-validator` then you need `ValidationException`:

```typescript
import {ValidationException} from `@rxstack/exceptions`

const errors: ValidationError[];
throw new ValidationException(errors);
```

### <a name="helpers"></a> Helpers
To transform a native error to exception, you can use:

```typescript
import {transformToException} from `@rxstack/exceptions`

// returns instance of Exception
transformToException(error);
```

## License

Licensed under the [MIT license](LICENSE).
