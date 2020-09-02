import express from 'express';

export namespace UserController {

  export async function test(req: express.Request, res: express.Response) {
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });

    res.json({
      message: 'Hello!',
    });
  }

}
