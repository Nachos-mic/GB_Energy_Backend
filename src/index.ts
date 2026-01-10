import App from "./app"
import ProductController from "../controllers/product.controller";

const productController = new ProductController();
const blacklistController = new BlacklistController();


const app = new App(
    [
        blacklistController,
        productController
    ]
);


app.listen();