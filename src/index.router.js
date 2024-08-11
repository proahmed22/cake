import { globalErrorHandling } from './utils/errorHandling.js';
import authRouter from './modules/auth/auth.routes.js';
import userRouter from './modules/user/user.routes.js';
import productRouter from './modules/product/product.routes.js';


export function bootstrap(app) {
    app.use('/api/v1/users', userRouter);
    app.use('/api/v1/auth', authRouter);
    app.use('/api/v1/products', productRouter);

    app.all('*', (req, res, next) => {
        next(new Error('Page Not Found', { cause: 404 }));
    })





    app.use(globalErrorHandling)
}
