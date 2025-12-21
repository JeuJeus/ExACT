# Extended Adversary Compromise Tool (ExACT)
This repository contains the sourcecode for the prototypical tool implementation *ExACT*.  
It serves as a reference implementation for our contribution enabling the analysis of 'Attack Resilience Hyperproperties' (ARHs) with the Tamarin Prover.
Or in other words, this repository extends the Tamarin Security protocol verification tool through a wrapper, enabling the ability to formally verify security properties requiring hyperproperty based analysis.

# Related Paper
You can find our research paper under the following DOI at Springer Nature : [https://doi.org/10.1007/978-3-032-10444-1_2](https://doi.org/10.1007/978-3-032-10444-1_2).  
Additionally we provide a [Pre-Print Version](https://julius.figge.eu/papers/Preprint_Paper_Attack-Resilience-Hyperproperties_Figge-et-al.pdf).

# Running 
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

# Citation
If you use this software or research, please cite it as below.
```latex
@inproceedings{figge2025attack,
  title={Attack Resilience Hyperproperties: Formal Security Analysis of (Automotive) Network Architectures Under Active Compromise},
  author={Figge, Julius and Knuplesch, David and Maletti, Andreas and Zuvic, Dragan},
  booktitle={International Conference on Software Engineering and Formal Methods},
  pages={15--33},
  year={2025},
  organization={Springer}
}
```

