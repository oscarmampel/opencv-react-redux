import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { 
  IonApp,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent
} from '@ionic/react';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import { VideoSandbox } from './components/video_sandbox/video_sandbox';

const App: React.FC = () => (
  <IonApp>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Tab Three</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <VideoSandbox></VideoSandbox>
    </IonContent>
  </IonApp>
);

export default App;
