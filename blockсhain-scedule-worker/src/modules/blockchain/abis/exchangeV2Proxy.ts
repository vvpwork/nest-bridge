const exchangeV2ProxyAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'hash',
        type: 'bytes32',
      },
    ],
    name: 'Cancel',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newLeftFill',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newRightFill',
        type: 'uint256',
      },
    ],
    name: 'Match',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'assetType',
        type: 'bytes4',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'matcher',
        type: 'address',
      },
    ],
    name: 'MatcherChange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'oldValue',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newValue',
        type: 'uint256',
      },
    ],
    name: 'ProtocolFeeChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes4',
        name: 'assetType',
        type: 'bytes4',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'proxy',
        type: 'address',
      },
    ],
    name: 'ProxyChange',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'transferProxy',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'erc20TransferProxy',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'newProtocolFee',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'newDefaultFeeReceiver',
        type: 'address',
      },
      {
        internalType: 'contract IRoyaltiesProvider',
        name: 'newRoyaltiesProvider',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'securitizeRegistryProxy',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'contractsRegistryProxy',
        type: 'address',
      },
    ],
    name: '__ExchangeV2_init',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'maker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'makeAsset',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'taker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'takeAsset',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'bytes4',
            name: 'dataType',
            type: 'bytes4',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'order',
        type: 'tuple',
      },
    ],
    name: 'cancel',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'contractsRegistryProxy',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'defaultFeeReceiver',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'feeReceivers',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'fills',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isWhitelistedNativePaymentToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
    ],
    name: 'isWhitelistedPaymentToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'maker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'makeAsset',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'taker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'takeAsset',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'bytes4',
            name: 'dataType',
            type: 'bytes4',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'orderLeft',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signatureLeft',
        type: 'bytes',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'maker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'makeAsset',
            type: 'tuple',
          },
          {
            internalType: 'address',
            name: 'taker',
            type: 'address',
          },
          {
            components: [
              {
                components: [
                  {
                    internalType: 'bytes4',
                    name: 'assetClass',
                    type: 'bytes4',
                  },
                  {
                    internalType: 'bytes',
                    name: 'data',
                    type: 'bytes',
                  },
                ],
                internalType: 'struct LibAsset.AssetType',
                name: 'assetType',
                type: 'tuple',
              },
              {
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
              },
            ],
            internalType: 'struct LibAsset.Asset',
            name: 'takeAsset',
            type: 'tuple',
          },
          {
            internalType: 'uint256',
            name: 'salt',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'bytes4',
            name: 'dataType',
            type: 'bytes4',
          },
          {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
          },
        ],
        internalType: 'struct LibOrder.Order',
        name: 'orderRight',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signatureRight',
        type: 'bytes',
      },
    ],
    name: 'matchOrders',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'onlyWhitelistedAddress',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'protocolFee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'royaltiesRegistry',
    outputs: [
      {
        internalType: 'contract IRoyaltiesProvider',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'securitizeRegistryProxy',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'assetType',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'matcher',
        type: 'address',
      },
    ],
    name: 'setAssetMatcher',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newContractsRegistryProxy',
        type: 'address',
      },
    ],
    name: 'setContractsRegistryProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newDefaultFeeReceiver',
        type: 'address',
      },
    ],
    name: 'setDefaultFeeReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'wallet',
        type: 'address',
      },
    ],
    name: 'setFeeReceiver',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'newProtocolFee',
        type: 'uint256',
      },
    ],
    name: 'setProtocolFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IRoyaltiesProvider',
        name: 'newRoyaltiesRegistry',
        type: 'address',
      },
    ],
    name: 'setRoyaltiesRegistry',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newSecuritizeRegistryProxy',
        type: 'address',
      },
    ],
    name: 'setSecuritizeRegistryProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'assetType',
        type: 'bytes4',
      },
      {
        internalType: 'address',
        name: 'proxy',
        type: 'address',
      },
    ],
    name: 'setTransferProxy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bool',
        name: 'whitelist',
        type: 'bool',
      },
    ],
    name: 'whitelistNativePaymentToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'whitelist',
        type: 'bool',
      },
    ],
    name: 'whitelistPaymentToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

export { exchangeV2ProxyAbi };
