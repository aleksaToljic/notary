export class ConfigService {

    private server_host = '159.65.113.106';
    private server_port = '3000';
    private server: string = this.server_host + ':' + this.server_port + '/';
    private ssl = false;
    server_url: string;


    notary_contract_address = '0x45945eab8793eb1668b124531b08e8cd9db92cb3';
    notary_contract_abi: any = [
        {
            'constant': false,
            'inputs': [
                {
                    'name': 'receiver',
                    'type': 'address'
                },
                {
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'name': 'signature',
                    'type': 'string'
                },
                {
                    'name': 'ignored',
                    'type': 'bool'
                }
            ],
            'name': 'receive',
            'outputs': [],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'function'
        },
        {
            'constant': false,
            'inputs': [
                {
                    'name': 'sender',
                    'type': 'address'
                },
                {
                    'name': 'receiver',
                    'type': 'address'
                },
                {
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'name': 'signature',
                    'type': 'string'
                }
            ],
            'name': 'send',
            'outputs': [],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'function'
        },
        {
            'constant': false,
            'inputs': [
                {
                    'name': 'signer',
                    'type': 'address'
                },
                {
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'name': 'signature',
                    'type': 'string'
                },
                {
                    'name': 'agreed',
                    'type': 'bool'
                }
            ],
            'name': 'sign',
            'outputs': [],
            'payable': false,
            'stateMutability': 'nonpayable',
            'type': 'function'
        },
        {
            'anonymous': false,
            'inputs': [
                {
                    'indexed': true,
                    'name': 'signer',
                    'type': 'address'
                },
                {
                    'indexed': true,
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'indexed': false,
                    'name': 'signature',
                    'type': 'string'
                },
                {
                    'indexed': true,
                    'name': 'agreed',
                    'type': 'bool'
                }
            ],
            'name': 'Signed',
            'type': 'event'
        },
        {
            'anonymous': false,
            'inputs': [
                {
                    'indexed': true,
                    'name': 'sender',
                    'type': 'address'
                },
                {
                    'indexed': true,
                    'name': 'receiver',
                    'type': 'address'
                },
                {
                    'indexed': true,
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'indexed': false,
                    'name': 'signature',
                    'type': 'string'
                }
            ],
            'name': 'Sent',
            'type': 'event'
        },
        {
            'anonymous': false,
            'inputs': [
                {
                    'indexed': true,
                    'name': 'signer',
                    'type': 'address'
                },
                {
                    'indexed': true,
                    'name': 'documentHash',
                    'type': 'bytes32'
                },
                {
                    'indexed': false,
                    'name': 'signature',
                    'type': 'string'
                },
                {
                    'indexed': true,
                    'name': 'ignored',
                    'type': 'bool'
                }
            ],
            'name': 'Received',
            'type': 'event'
        }
    ];
    contract_deployed_at_block: number = 0;

    network_name: string = 'kovan';

    constructor() {
        if (this.ssl === false) {
            this.server_url = 'http://' + this.server;
        } else {
            this.server_url = 'https://' + this.server;
        }
    }

}
