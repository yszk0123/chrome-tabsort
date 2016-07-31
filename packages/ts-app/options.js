import configureStore from './src/configureStore';
import { bootstrap } from 'ts-page-options';

const store = configureStore();
bootstrap({ store });
