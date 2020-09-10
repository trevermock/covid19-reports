import { Dispatch } from 'redux';
import axios from 'axios';

export namespace Roster {
  export namespace Actions {
    export class Upload {
      static type = 'ROSTER_UPLOAD';
      type = Upload.type;
    }
  }

  export const upload = (file: File) => async (dispatch: Dispatch<Actions.Upload>) => {
    console.log('uploading file...');
    console.log('file', file);

    var formData = new FormData();
    // var imagefile = document.querySelector('#file');
    // formData.append("image", imagefile.files[0]);
    formData.append('roster_csv', file);
    await axios.post(`api/roster/1/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    console.log('upload complete!');

    dispatch({
      ...new Actions.Upload()
    });
  }
}

