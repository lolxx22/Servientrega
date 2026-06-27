import { Request, Response } from 'express';
import { AIService } from '../../services/openrouter.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../../../shared/types';

const aiService = new AIService();

export class AIController {
  async chat(req: AuthRequest, res: Response) {
    const { messages } = req.body;
    const userId = req.user?.userId;

    const result = await aiService.chat(messages, userId);

    const response: ApiResponse = {
      success: true,
      data: {
        content: result.content,
        tokensUsed: result.tokensUsed,
      },
    };
    res.status(200).json(response);
  }
}
