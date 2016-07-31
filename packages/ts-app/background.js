import configureStore from './src/configureStore';
import { bootstrap } from 'ts-page-background';

const store = configureStore();
bootstrap({ store });
