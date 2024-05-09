import SQLite from 'react-native-sqlite-storage';

export default class LocalDB {
    static connect() {
        return SQLite.openDatabase({name: 'inventario'});
    }

    static async init() {
        const db = await LocalDB.connect();
        db.transaction((tx) => {
            tx.executeSql(
                'CREATE TABLE IF NOT EXISTS productos  (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre varchar(64) not null, precio decimal(10,2) not null default 0.0, miniStock INTEGER not null default 0, currentStock INTEGER not null default 0, maxStock INTEGER not null default 0)',
                [],
                () => console.log('Created table Productos'),
                (error) => console.error(error)
            );
            
        });
    }
}
