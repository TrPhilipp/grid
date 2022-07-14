import './App.css';
import 'devextreme/dist/css/dx.light.css';
import { DataGrid } from 'devextreme-react/data-grid';
import mock from './report-config.json';
import { useState, useRef, useEffect } from 'react';
import deleteBtn from './assets/deleteBtn.svg';
import editBtn from './assets/editBtn.svg';

const columns = ['CompanyName', 'City', 'State', 'Phone', 'Fax'];

function App() {
  const [editCol, setEditCol] = useState([]);
  const [inputStatus, setInputStatus] = useState(() => {
    return columns.reduce((acc, col) => {
      return { ...acc, [col]: { disabled: true, value: col } };
    }, {});
  });
  const [newColumn, setNewColumn] = useState({
    isActive: false,
    value: {
      dataField: '',
      caption: '',
    },
  });

  const grid = useRef(null);

  useEffect(() => {
    setEditCol(
      grid?.current?.instance?.getVisibleColumns().map((el) => el.dataField)
    );
  }, []);

  const addColumn = async () => {
    grid.current.instance.addColumn({
      dataField: newColumn.value.dataField,
      caption: newColumn.value.caption,
    });
    await setInputStatus(
      grid?.current?.instance?.getVisibleColumns().reduce((acc, el) => {
        return {
          ...acc,
          [el.dataField]: { disabled: true, value: el.dataField },
        };
      }, {})
    );
    await setEditCol(
      grid?.current?.instance?.getVisibleColumns().map((el) => el.dataField)
    );
    await setNewColumn({
      isActive: false,
      value: {
        dataField: '',
        caption: '',
      },
    });
  };

  const deleteColumn = (id) => {
    grid.current.instance.deleteColumn(id);
    setInputStatus(
      grid?.current?.instance?.getVisibleColumns().reduce((acc, el) => {
        return {
          ...acc,
          [el.dataField]: { disabled: true, value: el.dataField },
        };
      }, {})
    );
    setEditCol(
      grid?.current?.instance?.getVisibleColumns().map((el) => el.dataField)
    );
  };

  const startEdit = (col) =>
    setInputStatus((prev) => {
      return { ...prev, [col]: { ...prev[col], disabled: false } };
    });

  const saveNewName = (col, e) => {
    setInputStatus((prev) => {
      return { ...prev, [col]: { ...prev[col], disabled: true } };
    });
    console.log(inputStatus[col].value);
    grid.current.instance.columnOption(col, 'caption', inputStatus[col].value);
  };

  const stopEdit = (col) => {
    const prevValue = grid.current.instance.columnOption(col, 'caption');
    setInputStatus((prev) => {
      return { ...prev, [col]: { value: prevValue, disabled: true } };
    });
  };

  const onChange = (col, e) =>
    setInputStatus((prev) => {
      return { ...prev, [col]: { ...prev[col], value: e.target.value } };
    });

  const startAdding = () => {
    setNewColumn((prev) => {
      return { ...prev, isActive: true };
    });
  };

  const cancelAdding = () => {
    setNewColumn((prev) => {
      return {
        isActive: false,
        value: {
          dataField: '',
          caption: '',
        },
      };
    });
  };

  const changeNewColValues = (input, e) => {
    setNewColumn((prev) => {
      return { ...prev, value: { ...prev.value, [input]: e.target.value } };
    });
  };
  return (
    <div className="container">
      <DataGrid
        showBorders={true}
        width="70%"
        ref={grid}
        dataSource={mock}
        defaultColumns={columns}
      ></DataGrid>
      <div className="second">
        <div style={{ margin: '5px 0 0 5px' }}>
          {editCol.map((el) => (
            <div style={{ display: 'flex' }}>
              <div>
                <input
                  value={inputStatus[el].value}
                  onChange={onChange.bind(null, el)}
                  disabled={inputStatus[el].disabled ?? true}
                />
                {!inputStatus[el].disabled && (
                  <div style={{ margin: '5px 0' }}>
                    <button onClick={saveNewName.bind(null, el)}>Save</button>
                    <button
                      style={{ marginLeft: '5px' }}
                      onClick={stopEdit.bind(null, el)}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <div>
                <img
                  src={deleteBtn}
                  alt="delete"
                  onClick={deleteColumn.bind(null, el)}
                />
                <img
                  src={editBtn}
                  alt="edit"
                  onClick={startEdit.bind(null, el)}
                />
              </div>
            </div>
          ))}
          <button onClick={startAdding}>Add</button>
          {newColumn.isActive && (
            <div>
              <input
                style={{ marginTop: '5px' }}
                placeholder="dataField"
                value={newColumn.value.dataField}
                onChange={changeNewColValues.bind(null, 'dataField')}
              />
              <input
                style={{ marginTop: '5px' }}
                placeholder="capgtion"
                value={newColumn.value.caption}
                onChange={changeNewColValues.bind(null, 'caption')}
              />
              <div style={{ marginTop: '5px' }}>
                <button onClick={addColumn}>Save</button>
                <button style={{ marginLeft: '5px' }} onClick={cancelAdding}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
