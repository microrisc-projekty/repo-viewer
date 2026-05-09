// Repository types
export interface IProduct {
	hwpid: number;
	name: string;
	manufacturerID: number;
	companyName: string;
	homePage: string;
	picture: string;
	rfMode: number;
	metadata: IProductMetadata;
}

export interface IProductMetadata {
	static: [
		{
			version: number;
			profiles: [
				{
					hwpidVersions: {
						min: number;
						max: number;
					};
					routing: boolean; //[specifies whether the online device is routing packets in the IQRF network]
					beaming: boolean; //[specifies whether beaming mode is implemented in the device]
					frcAggregation: boolean; //[specifies whether the device implements a function that aggregates data from the beaming devices]
					iqarosCompatible: boolean; //[specifies whether the device is compatible with IQAROS system]
					iqrfSensor: number[]; //[specifies whether the device contains a standard IQRF sensor]
					//[typy senzorů dle https://www.iqrfalliance.org/techdoc_files/IQRF-StandardSensor_V015.pdf]
					iqrfBinaryOutput: number; //[specifies whether the device contains a standard binary output, such as a relay]
					powerSupply: {
						mains: boolean; //[specifies whether the device is mains powered]
						accumulator: {
							present: boolean; //[specifies whether the device contains a accumulator]
							type: string | null; //[specifies the type of accumulator]
							lowLevel: number | null; //[specifies the voltage level for a discharged accumulator]
						};
						battery: {
							present: boolean; //[specifies whether the device contains a accumulator]
							type: string | null; //[specifies the type of battery]
							changeThreshold: number | null; //[specifies the voltage level for which it is recommended to replace the battery]
						};
						minVoltage: number | null; //[specifies the voltage level for which it is recommended to replace the battery]
					};
				},
			];
		},
	];
	extra: object;
}

export interface IManufacturer {
	manufacturerID: number;
	companyID: number;
	name: string;
}
