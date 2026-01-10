import { Router } from 'express';

interface Controller {
    main_path: string;
    router: Router;
}

export default Controller;