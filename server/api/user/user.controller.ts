import express from 'express';

const users: { [key: string]: string; } = { };
users['0000000001'] = 'Root Admin User';
users['0000000002'] = 'Organizational Admin User';
users['0000000003'] = 'Basic User';

export namespace UserController {

  export async function role(req: any, res: express.Response) {
    console.log('Authorized: ', req.client.authorized);
    if (req.client.authorized) {
      const certificate = req.connection.getPeerCertificate();
      const subjectName = certificate.subject.CN;
      const id = subjectName.substr(subjectName.lastIndexOf('.') + 1, subjectName.length);
      if (users.hasOwnProperty(id)) {
        res.json({
          message: 'Registered User: ' + users[id]
        });
      } else {
        res.json({
          message: 'Unknown User ID: ' + id,
        });
      }
    } else {
      res.json({
        message: 'Not authorized.'
      });
    }
  }

}
