const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Адрес развернутого контракта
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
        "name": "magic",
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
            "name": "magic",
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
        "name": "magic",
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
    "inputs": [],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
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

// Инициализация контракта
async function init() {
  try {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to use this app.");
      return;
    }

    // Проверяем, разрешено ли приложению подключаться
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      console.warn("No active wallet found. Requesting access...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
    }

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, abi, signer);

    console.log("MetaMask initialized successfully. Contract:", contractAddress);
  } catch (error) {
    console.error("Error initializing MetaMask:", error);
  }
}

// Покупка амулета
async function buyAmulet() {
  try {
    const tx = await contract.buyAmulet({ value: ethers.utils.parseEther("0.01") });
    await tx.wait();
    alert("Amulet purchased successfully!");
  } catch (error) {
    console.error("Error buying amulet:", error);
  }
}

// Получение списка амулетов
async function getAmulets() {
  try {
    if (!signer) {
      throw new Error("MetaMask не подключён. Пожалуйста, подключите MetaMask.");
    }

    const address = await signer.getAddress();
    const amulets = await contract.getAmuletsByOwner(address);

    // Форматирование вывода
    const amuletList = amulets.map((amulet, index) => {
      return `Amulet #${amulet.id}:\n  Power: ${amulet.power}\n  Magic: ${amulet.magic}\n  Rarity: ${amulet.rarity}\n`;
    });

    document.getElementById("amuletsList").textContent = amuletList.join("\n");
  } catch (error) {
    console.error("Error fetching amulets:", error);
    alert(error.message);
  }
}

window.onload = function () {
  document.getElementById("connectWalletBtn").addEventListener("click", connectWallet);
  const buyAmuletBtn = document.getElementById("buyAmuletBtn");
  const getAmuletsBtn = document.getElementById("getAmuletsBtn");

  if (buyAmuletBtn) {
    buyAmuletBtn.addEventListener("click", buyAmulet);
  }

  if (getAmuletsBtn) {
    getAmuletsBtn.addEventListener("click", getAmulets);
  }

  // Инициализация приложения
  init();
};
