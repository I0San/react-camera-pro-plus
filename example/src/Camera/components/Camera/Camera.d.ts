/// <reference types="dom-mediacapture-record" />
import React from 'react';
import { CameraProps, CameraRef } from './types';
declare global {
    interface Window {
        MediaRecorder: typeof MediaRecorder;
    }
}
export declare const Camera: React.ForwardRefExoticComponent<CameraProps & React.RefAttributes<CameraRef>>;
