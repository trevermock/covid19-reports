import { createConnection } from 'typeorm';
import ormconfig from '../../ormconfig';

export default createConnection(ormconfig);
