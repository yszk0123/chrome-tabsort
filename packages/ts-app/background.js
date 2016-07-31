import { bootstrap } from 'ts-page-background';
import configureStore from './src/configureStore';

const store = configureStore();
bootstrap({ store });
