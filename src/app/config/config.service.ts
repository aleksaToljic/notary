export class ConfigService {

    server_url: string;
    notary_contract_address = '0xff178a52a458a94a150953494170e597e918fdd0';
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
            'name': 'Received',
            'type': 'event'
        }
    ];
    contract_deployed_at_block: number = 0;
    network_name: string = 'kovan';
    private server_host = '159.65.113.106';
    private server_port = '3000';
    private server: string = this.server_host + ':' + this.server_port + '/';
    private ssl = false;

    constructor() {
        if (this.ssl === false) {
            this.server_url = 'http://' + this.server;
        } else {
            this.server_url = 'https://' + this.server;
        }
    }

}
