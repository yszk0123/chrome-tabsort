import { bootstrap } from 'ts-page-options';
import configureStore from './src/configureStore';
import './src/styles.css';

const store = configureStore();
bootstrap({ store });
