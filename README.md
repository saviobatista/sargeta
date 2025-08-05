# SARGETA

**Sistema Automático de Representação, Gerenciamento e Ensino de Tráfego Aéreo**  
*Automatic System for Air Traffic Representation, Management and Teaching*

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/saviobatista/sargeta)
[![License](https://img.shields.io/badge/license-Private-red.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://electronjs.org/)

## 📋 Overview

SARGETA is a comprehensive **Air Traffic Control (ATC) training and simulation system** designed for aviation education and professional development. Built as an Electron desktop application, it provides a realistic environment for learning and practicing air traffic control operations including ground control (GND), tower control (TWR), and clearance delivery (CLR).

## ✨ Features

### 🎯 Core Functionality
- **Real-time flight strip management** with digital flight progress strips
- **Multi-position ATC operations** (CLR, GND, TWR)
- **Client-server architecture** for multi-user training scenarios
- **Exercise planning and management** with automated timing
- **Professional ATC interface** with industry-standard colors and layouts

### 🛩️ Aircraft Operations
- **Departure management** with complete workflow progression
- **Arrival sequencing** and ground movement control
- **Flight plan integration** from CGNA format files
- **Real-time status tracking** and coordination between positions
- **Automatic strip progression** through operational phases

### 📊 Training & Assessment
- **Scenario-based training** with configurable complexity
- **Instructor controls** (pause, freeze, lock interface)
- **Comprehensive logging** of all operations and timing
- **Multi-client coordination** practice
- **Performance tracking** and assessment tools

### 🔧 Technical Features
- **Excel integration** for flight plan import/export
- **Network synchronization** across multiple workstations
- **Configurable airport parameters** (runways, SIDs, transitions)
- **Weather condition simulation**
- **Timer and chronometer functions**

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn package manager
- Windows, macOS, or Linux

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saviobatista/sargeta.git
   cd sargeta
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm test
   ```

### First-time Setup

1. **Initial Configuration**
   - Choose between **Server** or **Client** mode
   - Set machine identifier (e.g., "TWR01", "GND01")
   - Configure server IP address (for client mode)

2. **Server Setup** (if running server mode)
   - Configure port (default: 3000)
   - Set simulation time and parameters
   - Import flight plan files (XLSX format)
   - Configure airport settings (runways, procedures)

3. **Client Setup** (if running client mode)
   - Connect to server IP address
   - Select operational mode (TWR, CLR+GND, or combined)
   - Choose position assignment

## 🎮 Usage Guide

### Server Operations

**Starting a Training Session:**
1. Launch in Server mode
2. Load configuration and flight plans
3. Set simulation parameters
4. Start server and wait for client connections
5. Control exercise flow (play/pause/lock)

**Server Controls:**
- **Start/Stop** - Initialize or terminate the simulation
- **Play/Pause** - Control simulation time flow  
- **Lock/Unlock** - Freeze all client interfaces
- **Converter** - Import/export flight plan data

### Client Operations

**ATC Interface Layout:**
- **Left Panel**: Authorization (CLR) and inactive strips
- **Center Panel**: Ground control (GND) and clearance operations
- **Right Panel**: Tower control (TWR) and arrivals
- **Far Right**: Sequencing and uncontrolled aircraft

**Strip Progression:**
- **Enter** - Advance strip to next phase
- **Escape** - Revert strip to previous phase  
- **Delete** - Remove strip from system
- **F3** - Create new arrival/departure
- **F7** - Set timer on active strip
- **F8** - Create functional strip

**Navigation:**
- **Arrow keys** - Navigate between strips and sections
- **Mouse clicks** - Select strips and access menus
- **Right-click** - Modify strip parameters (SID, runway, etc.)

### Operational Modes

**Tower (TWR) Mode:**
- Focus on runway and airborne operations
- Arrival sequencing and departure coordination
- Reduced ground movement visibility

**Clearance + Ground (CLR-GND) Mode:**
- Ground movement and clearance delivery
- Pushback and taxi coordination
- Gate and ramp management

**Combined (CLR-GND-TWR) Mode:**
- Full airport operations
- Complete workflow from gate to gate
- All ATC positions integrated

## 🏗️ Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client 1      │    │   Client 2      │    │   Client N      │
│   (TWR)         │    │   (GND)         │    │   (CLR)         │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │      SARGETA Server     │
                    │   - Exercise Control    │
                    │   - Data Synchronization│
                    │   - Flight Plan Management│
                    └─────────────────────────┘
```

### File Structure

```
sargeta/
├── main.js              # Electron main process
├── server.module.js     # Core server logic
├── client.js           # Client interface logic
├── client.html         # ATC operator interface
├── server.js           # Server renderer process
├── server.html         # Server control interface
├── settings.js         # Configuration handler
├── settings.html       # Setup interface
├── template.js         # Flight strip templates
├── converter.js        # Excel data conversion
├── assets/             # Stylesheets and resources
│   ├── style.css       # Main interface styles
│   ├── colors.css      # ATC color schemes
│   ├── fonts.css       # Typography
│   └── icon.css        # Icon definitions
└── package.json        # Project configuration
```

## ⚙️ Configuration

### Server Configuration

**Basic Settings:**
- **Port**: Network port for client connections (default: 3000)
- **Time**: Simulation start time
- **Local**: Airport identifier (e.g., SBKP)
- **Strip Creation Time**: Minutes ahead to display strips

**Airport Configuration:**
- **Active Runway**: Current runway in use
- **Available Runways**: Comma-separated list (e.g., "18,36")
- **SIDs**: Standard Instrument Departures
- **Transitions**: Available transition procedures

**Flight Plans:**
- Import XLSX files with flight plan data
- Support for CGNA format
- Automatic timing calculations
- Exercise documentation generation

### Client Configuration

**Connection Settings:**
- Server IP address and port
- Machine identifier
- Operational mode selection

**Interface Preferences:**
- Weather conditions (VMC/IMC)
- Runway operations status
- Position-specific visibility

## 🔧 Development

### Building from Source

**Development Mode:**
```bash
npm run test
```

**Package Application:**
```bash
npm run pack    # Directory build
npm run dist    # Installable package
```

### Dependencies

**Runtime:**
- Electron 35.0.0
- Express 5.1.0
- jQuery 3.4.1
- Bootstrap 5.3.3

**Excel Processing:**
- excel4node 1.8.2
- exceljs 4.4.0

**Development:**
- electron-builder 26.0.12
- electron-packager 18.3.2

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with both server and client modes
5. Submit a pull request

## 📸 Screenshots

The application includes several preview images showing the interface:
- `sargeta-preview-01.png` through `sargeta-preview-06.png`

## 🏢 Airport Support

**Primary Configuration: SBKP (Viracopos/Campinas)**
- Brazilian airport operations
- TAKP control procedures
- Local SID/STAR procedures
- Weather and operational conditions

**Extensible Design:**
- Configurable for other airports
- Customizable procedures and layouts
- Adaptable to different ATC environments

## 📋 System Requirements

**Minimum:**
- 4GB RAM
- 1GB available disk space
- Network connectivity (for multi-client setup)
- Display resolution: 1366x768

**Recommended:**
- 8GB RAM
- Multiple monitors for realistic ATC setup
- Dedicated network for training environment
- Display resolution: 1920x1080 or higher

## 🐛 Troubleshooting

**Common Issues:**

1. **Client cannot connect to server**
   - Check firewall settings
   - Verify server IP and port
   - Ensure server is running

2. **Flight strips not appearing**
   - Check flight plan file format
   - Verify time parameters
   - Confirm data import successful

3. **Interface freezing**
   - Check for instructor lock mode
   - Verify network connectivity
   - Restart client application

## 📄 License

This project is privately licensed. Contact the author for usage permissions.

## 👨‍💻 Author

**Sávio Batista**
- GitHub: [@saviobatista](https://github.com/saviobatista)
- Project: [SARGETA](https://github.com/saviobatista/sargeta)

## 🙏 Acknowledgments

- Brazilian Air Navigation Center (CGNA) for data format specifications
- EPTA Viracopos/Campinas for operational requirements
- TAKP-4 Operational Assessment Coordination

---

**SARGETA** - Professional Air Traffic Control Training System