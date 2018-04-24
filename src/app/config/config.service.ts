export class ConfigService {

    server_host = '192.168.88.75';
    server_port = '3000';
    server: string = this.server_host + ':' + this.server_port + '/';
    ssl = false;
    server_url: string;

    notary_contract_address = '0xb000b1f92fa7bc9fc4571a4378ecb23368842d7a';
    notary_contract_abi: any = [
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
        }
    ];
    contract_deployed_at_block: number = 0;

    network_name: string = 'kovan';

    constructor() {
        if (this.ssl == false) {
            this.server_url = 'http://' + this.server;
        } else {
            this.server_url = 'https://' + this.server;
        }
    }

}
