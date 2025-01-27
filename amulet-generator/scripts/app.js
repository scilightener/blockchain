const contractAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "power",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "rarity",
        "type": "uint256"
      }
    ],
    "name": "AmuletCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "AMULET_PRICE",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyAmulet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getAmuletsByOwner",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "id",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "power",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "rarity",
            "type": "uint256"
          }
        ],
        "internalType": "struct AmuletGenerator.Amulet[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_owner",
        "type": "address"
      }
    ],
    "name": "getUserPower",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextAmuletId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amuletId",
        "type": "uint256"
      }
    ],
    "name": "upgradeAmulet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amuletId",
        "type": "uint256"
      }
    ],
    "name": "useAmulet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userAmulets",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "id",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "power",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "rarity",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "userPower",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider, signer, contract;

async function connectWallet() {
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected account:", accounts[0]);
  } catch (error) {
    console.error("Error connecting to wallet:", error);
  }
}

async function init() {
  try {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to use this app.");
      return;
    }

    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      console.warn("No active wallet found. Requesting access...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("MetaMask initialized successfully. Contract:", contractAddress);
    getAmulets();
    updateUserPower();
  } catch (error) {
    console.error("Error initializing MetaMask:", error);
  }
}

async function buyAmulet() {
  try {
    const tx = await contract.buyAmulet({ value: ethers.utils.parseEther("0.01") });
    await tx.wait();
    alert("Amulet purchased successfully!");
    getAmulets();
    updateUserPower();
  } catch (error) {
    console.error("Error buying amulet:", error);
    alert("Failed to buy amulet");
  }
}

async function getAmulets() {
  try {
    if (!signer) {
      throw new Error("MetaMask не подключён. Пожалуйста, подключите MetaMask.");
    }

    const address = await signer.getAddress();
    const amulets = await contract.getAmuletsByOwner(address);

    console.log(amulets)
    let sortedAmulets = [...amulets]
    sortedAmulets.sort((a, b) => (a.id.toString() >= b.id.toString())? 0 : -1);

    const container = document.getElementById("amuletsList");
    container.innerHTML = '';

    sortedAmulets.forEach((amulet, index) => {
      const amuletDiv = document.createElement('div');
      amuletDiv.classList.add('amulet');

      const amuletTitle = document.createElement('h3');
      amuletTitle.textContent = `Amulet #${amulet.id}`;
      amuletDiv.appendChild(amuletTitle);

      const amuletDetails = document.createElement('ul');

      const powerDetail = document.createElement('li');
      powerDetail.textContent = `Power: ${amulet.power}`;
      amuletDetails.appendChild(powerDetail);

      const rarityDetail = document.createElement('li');
      rarityDetail.textContent = `Rarity: ${amulet.rarity}`;
      amuletDetails.appendChild(rarityDetail);

      amuletDiv.appendChild(amuletDetails);

      const buttonContainer = document.createElement('div');
      buttonContainer.style.display = 'flex';
      buttonContainer.style.alignItems = 'center';
      buttonContainer.style.gap = '10px';
      
      const upgradeButton = document.createElement('button');
      upgradeButton.textContent = 'Upgrade Amulet';
      upgradeButton.onclick = async () => {
        const ethAmount = prompt('Enter ETH amount to upgrade:');
        if (ethAmount) {
          await upgradeAmulet(amulet.id, ethAmount);
        }
      };
      buttonContainer.appendChild(upgradeButton);

      const useButton = document.createElement('button');
      useButton.textContent = 'Use Amulet';
      useButton.onclick = async () => {
        await useAmulet(amulet.id);
      };
      buttonContainer.appendChild(useButton);
      amuletDiv.appendChild(buttonContainer);
      container.appendChild(amuletDiv);
    });
  } catch (error) {
    console.error("Error fetching amulets:", error);
    alert("Failed to get amulets");
  }
}

async function upgradeAmulet(amuletId, ethAmount) {
  try {
    const ethValue = ethers.utils.parseEther(ethAmount);
    const tx = await contract.upgradeAmulet(amuletId, { value: ethValue });
    await tx.wait();
    alert(`Amulet ${amuletId} upgraded successfully!`);
    getAmulets();
  } catch (error) {
    console.error("Error upgrading amulet:", error);
    alert("Failed to upgrade amulet");
  }
}

async function useAmulet(amuletId) {
  try {
    const tx = await contract.useAmulet(amuletId);
    await tx.wait();
    alert(`Amulet ${amuletId} used successfully!`);
    getAmulets();
    updateUserPower();
  } catch (error) {
    console.error("Error using amulet:", error);
    alert("Failed to use amulet");
  }
}

async function updateUserPower() {
  if (!signer) {
    throw new Error("MetaMask не подключён. Пожалуйста, подключите MetaMask.");
  }

  const address = await signer.getAddress();
  const userPower = await contract.getUserPower(address);
  document.getElementById("userPower").textContent = "Your Power: " + userPower
}

window.onload = function () {
  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  const buyAmuletBtn = document.getElementById("buyAmuletBtn");

  if (buyAmuletBtn) {
    buyAmuletBtn.addEventListener("click", buyAmulet);
  }

  init();
};
