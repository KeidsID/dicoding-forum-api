import Locator from 'locustjs-locator'

Locator.Instance.register('authRepo', AuthRepo)
Locator.Instance.register('authTokenManager', AuthTokenManager)
Locator.Instance.register('passwordHasher', PasswordHasher)
Locator.Instance.register('userRepo', UserRepo)