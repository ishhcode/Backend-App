import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(upload.none()); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId").get(getVideoComments).post(verifyJWT,addComment);
router.route("/c/:commentId").delete(verifyJWT,deleteComment).patch(verifyJWT, updateComment);

export default router;