import { JSX as JSX_2 } from 'react/jsx-runtime';

declare function AsteroidBlaster({ onClose, onError }: AsteroidBlasterProps): JSX_2.Element;
export default AsteroidBlaster;

export declare interface AsteroidBlasterProps {
    onClose: () => void;
    onError?: (err: Error) => void;
}

export { }
