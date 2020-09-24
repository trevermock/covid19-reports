import { Dispatch } from 'redux';
import axios from 'axios';
import { AppState } from '../store';

export namespace Roster {

  export namespace Actions {

    export class Upload {
      static type = 'ROSTER_UPLOAD';
      type = Upload.type;
    }

  }

  export const upload = (file: File, onComplete: (count: number) => void) => async (dispatch: Dispatch<Actions.Upload>, getState: () => AppState) => {
    console.log('uploading file...');
    console.log('file', file);

    const appState = getState();

    if (!appState.user.activeRole) {
      console.log('User has no active role, cannot upload roster.');
      return;
    }

    const formData = new FormData();
    // var imagefile = document.querySelector('#file');
    // formData.append("image", imagefile.files[0]);
    formData.append('roster_csv', file);
    // TODO: Don't hardcode role.
    try {
      const response = await axios.post(`api/roster/${appState.user.activeRole.org.id}/bulk`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      onComplete(response.data.count);
    } catch {
      onComplete(-1);
    }

    console.log('upload complete!');

    dispatch({
      ...new Actions.Upload(),
    });
  };
}

