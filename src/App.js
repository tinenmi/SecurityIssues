import React, {useEffect, useState} from 'react';
import './App.css';

const RiskLevels = {
  CRITICAL: 'CRITICAL',
  HIGH: 'HIGH', 
  MEDIUM: 'MEDIUM',
  LOW: 'LOW',
  UNKNOWN: 'UNKNOWN',
};

const item = (id, title, riskLevel, rest = {}) => ({ id, title, riskLevel, ...rest });

const locale = {
  domain: ["Domain", "Domains"],
  device: ["Device", "Devices"],
  software: ["Software", "Software"],
};

const domains = [
  item(1, 'Customer Care', RiskLevels.CRITICAL),
  item(2, 'Finance', RiskLevels.LOW),
  item(3, 'Marketing', RiskLevels.MEDIUM),
];

const devices = [
  item(1, 'MacBook Pro CC', RiskLevels.CRITICAL, {groupIDs: [1]}),
  item(2, 'MacBook Pro CEO', RiskLevels.CRITICAL, {groupIDs: [2]}),
  item(3, 'MacBook Employee', RiskLevels.LOW, {groupIDs: [3]}),
  item(4, 'MacBook Air Finance', RiskLevels.MEDIUM, {groupIDs: [4]}),
  item(5, 'Asus Notebook Finance', RiskLevels.LOW, {groupIDs: [5]}),
]

const software = [
  item(1, 'Parallels', RiskLevels.CRITICAL, {groupIDs: [1]}),
  item(2, 'McAffee', RiskLevels.LOW, {groupIDs: [4]}),
  item(3, 'Photoshop', RiskLevels.MEDIUM, {groupIDs: [3]}),
  item(4, 'Illustrator', RiskLevels.MEDIUM, {groupIDs: [3]}),
  item(5, 'CEO Software', RiskLevels.MEDIUM, {groupIDs: [2]}),
  item(6, 'Safari', RiskLevels.MEDIUM, {groupIDs: [2]}),
  item(7, 'Internet Explorer', RiskLevels.MEDIUM, {groupIDs: [5]}),
]

const Checkbox = ({checked, $setChecked}) => {
  const onChange = () => $setChecked(!checked);
  const onCheckboxClick = e => e.stopPropagation();
  return (
    <input
      className="Column_input"
      type = "checkbox"
      checked = {checked}
      onChange = {onChange}
      onClick = {onCheckboxClick} />
  );
}

const Dropdown = ({title, children}) => {
  const [isOpened, setOpen] = useState(false);
  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return (
    <div className="Dropdown" onMouseEnter={open} onMouseLeave={close}>
      <a className="Header_button" href="#">
        {title}
      </a>
      <div className={`Dropdown_content ${!isOpened ? '' : 'Dropdown_content--opened'}`}>
        <div className="Dropdown_content-border">
          {children}
        </div>
      </div>
    </div>
  );
}

const DropdownFilter = ({activeRiskLevels, $setActiveRiskLevels}) => {
  const changeActiveRiskLevel = (R) => (newValue) => {
    const newActiveRiskLevels =  
      newValue 
        ? [...activeRiskLevels, R]
        : activeRiskLevels.filter(item => item !== R);
    $setActiveRiskLevels(newActiveRiskLevels);
  }

  return (
    <Dropdown title="Filter">
      {Object.values(RiskLevels).map(R =>
        <div className="Dropdown_item">
          <Checkbox
            checked = {activeRiskLevels.includes(R)}
            $setChecked = {changeActiveRiskLevel(R)} />
          <span className = {`RiskLevel RiskLevel--${R}`}>
            <span>
              {R}
            </span>
          </span>
        </div>
      )}
    </Dropdown>
  );
}

const Header = ({$reset, activeRiskLevels, $setActiveRiskLevels}) => {
  const onClick_Reset = e => {
    e.stopPropagation();
    $reset();
  }

  return (
    <div className="Header">
      <a className="Header_button" href="#" onClick={onClick_Reset}>
        Reset
      </a>
      <DropdownFilter
        activeRiskLevels = {activeRiskLevels}
        $setActiveRiskLevels = {$setActiveRiskLevels} />
    </div>
  )
}

const ColumnTitle = ({title, isCheckedAll, $checkAll}) => {
  const onChange = () => $checkAll(!isCheckedAll);

  return (
    <div className="Column_row Column_row--header">
      <input type = "checkbox" checked = {isCheckedAll} onChange = {onChange} />
      <span className = "Column_titleCell">{title}</span>
      <span className = "RiskLevel">Risk</span>
    </div>
  );
};

const ColumnRow = ({title, riskLevel, active, $setActive, isSelected, $setSelected}) => {
  const onClick = () => $setSelected(!isSelected);

  return (
    <div
      className = {`Column_row ${!isSelected ? '' : 'Column_row--selected'}`}
      onClick = {onClick} >
      <Checkbox checked = {active} $setChecked = {$setActive} />
      <span className = "Column_titleCell">
        {title}
      </span>
      <span className = {`RiskLevel RiskLevel--${riskLevel}`}>
        <span>
          {riskLevel}
        </span>
      </span>
    </div>
  );
};

const Column = ({
  title, items,
  activeItems, $setActiveItems,
  selectedItem, $setSelectedItem,
  selectedGroup, activeRiskLevels}) => 
{
  const [filteredByGroupItems, setFilteredByGroupItems] = useState(items);
  const [filteredItems, setFilteredItems] = useState(items);
  useEffect(() => {
    const newFilteredByGroupItems = items.filter(I => 
      !I.groupIDs || !selectedGroup || I.groupIDs.includes(selectedGroup.id)
    );

    setFilteredByGroupItems(newFilteredByGroupItems);
  }, [items, selectedGroup]);
  
  useEffect(() => {
    const newFilteredItems = filteredByGroupItems.filter(I => 
      !activeRiskLevels.length || activeRiskLevels.includes(I.riskLevel)
    );

    setFilteredItems(newFilteredItems);
  }, [filteredByGroupItems, activeRiskLevels]);

  const checkAll = (value) => {
    if (value) {
      $setActiveItems(filteredItems);
    } else {
      $setActiveItems([]);
    }
  }

  const setActive = (item) => (newIsActive) => {
    if (newIsActive) {
      $setActiveItems([...activeItems, item]);
    } else {
      $setActiveItems(activeItems.filter(I => I !== item));
    }
  }

  const setSelected = (item) => (newSelected) => {
    if (newSelected) {
      $setSelectedItem(item)
    } else {
      $setSelectedItem(undefined)
    }
  }

  return (
    <div className="Column">
      <div className="Column_title">
        Affected {title[1]} {!selectedGroup ? '' : `(${selectedGroup.title})`}
      </div>
      <ColumnTitle
        title = {title[0]}
        isCheckedAll = {activeItems.length !== 0 && activeItems.length === filteredItems.length}
        $checkAll = {checkAll} />
      {filteredItems.map(I => 
        <ColumnRow 
          title = {I.title}
          riskLevel = {I.riskLevel}
          active = {activeItems.includes(I)}
          $setActive = {setActive(I)}
          isSelected = {I === selectedItem}
          $setSelected = {setSelected(I)} />
      )}
    </div>
  )
}

const App = () => {
  const [selectedDomain, setSelectedDomain] = useState(domains[2]);
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [selectedSoftware, setSelectedSoftware] = useState();

  const reset = () => {
    setSelectedDomain();
    setSelectedDevice();
    setSelectedSoftware();
  }

  const [activeRiskLevels, setActiveRiskLevels] = useState([]);
  const [activeDomains, setActiveDomains] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);
  const [activeSoftware, setActiveSoftware] = useState([]);

  return (
    <div className="App">
      <Header
        $reset = {reset}
        activeRiskLevels = {activeRiskLevels}
        $setActiveRiskLevels = {setActiveRiskLevels}
      />
      <div className="Columns">
        <Column 
          title = {locale.domain} 
          items = {domains} 
          activeItems = {activeDomains}
          $setActiveItems = {setActiveDomains}
          selectedItem = {selectedDomain}
          $setSelectedItem = {setSelectedDomain}
          activeRiskLevels = {activeRiskLevels} />
        <Column
          title = {locale.device}
          items = {devices}
          activeRiskLevels = {activeRiskLevels}
          activeItems = {activeDevices}
          $setActiveItems = {setActiveDevices}
          selectedItem = {selectedDevice}
          $setSelectedItem = {setSelectedDevice}
          selectedGroup = {selectedDomain}
          activeRiskLevels = {activeRiskLevels} />
        <Column
          title = {locale.software}
          items = {software}
          activeItems = {activeSoftware}
          $setActiveItems = {setActiveSoftware}
          selectedItem = {selectedSoftware}
          $setSelectedItem = {setSelectedSoftware}
          selectedGroup = {selectedDevice} 
          activeRiskLevels = {activeRiskLevels} />
      </div>
    </div>
  );
}

export default App;
