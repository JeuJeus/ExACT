# Extended Adversary Compromise Tool (ExACT)
This repository contains the sourcecode for the prototypical tool implementation *ExACT*.

## How to Run
Provided through `run.sh` a script exists to automatically run the tool with the default (Case study from the paper) configuration.  

## Customization
In order to verify another Network Architecture / Protocol setup, make sure to configure:
- `.env` for the
  - relevant *Entities* i.e. ECUs and other protocol participants
  - involved *Domains* i.e. the network segments and trust boundaries as well as physical boundaries
- `mvp.spthy` for the *Architecture* and *Protocol*, as well as reflecting the above configured
The `package.json` provides targets to run the desired steps individually.


## Requirements
In order to run this tool you need to have installed
- node and npm 
- tamarin
- (dot)
- (python) only used for progress estimation


