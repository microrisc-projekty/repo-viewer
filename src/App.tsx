import { useCallback, useEffect, useMemo, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import type { IManufacturer, IProduct } from './types';

const REPO_URL = 'https://repository.iqrfalliance.org/api';
const DEV_REPO_URL = 'https://devrepo.iqrfalliance.org/api';

function App() {
	const [products, setProducts] = useState<IProduct[]>([]);
	const [manufacturers, setManufacturers] = useState<IManufacturer[]>([]);

	const fetchProducts = useCallback((devRepo = false) => {
		fetch((devRepo ? DEV_REPO_URL : REPO_URL) + '/products')
			.then((d) => d.json())
			.then((d) => setProducts(d));
	}, []);
	const fetchManufacturers = useCallback((devRepo = false) => {
		fetch((devRepo ? DEV_REPO_URL : REPO_URL) + '/manufacturers')
			.then((d) => d.json())
			.then((d) => setManufacturers(d));
	}, []);

	const [devRepo, setDevRepo] = useState(false);

	useEffect(() => {
		fetchProducts(devRepo);
		fetchManufacturers(devRepo);
	}, [fetchProducts, fetchManufacturers, devRepo]);

	const hwpids = useMemo(
		() => new Set(products.map((p) => p.hwpid)),
		[products],
	);

	const [searchValue, setSearchValue] = useState('');
	const [search, setSearch] = useState<string | null>(null);
	const filteredProducts = useMemo(
		() => products.filter((p) => !search || p.hwpid === parseInt(search)),
		[products, search],
	);

	return (
		<main className="p-5">
			<h1 className="text-4xl">IQRF Repository viewer</h1>
			<div className="flex flex-row gap-2 my-4">
				<button
					className={
						'bg-blue-400 px-3 py-2 cursor-pointer' +
						(!devRepo ? ' bg-blue-600' : '')
					}
					onClick={() => setDevRepo(false)}
				>
					Public repo
				</button>
				<button
					className={
						'bg-blue-400 px-3 py-2 cursor-pointer' +
						(devRepo ? ' bg-blue-600' : '')
					}
					onClick={() => setDevRepo(true)}
				>
					Dev repo
				</button>
				<div className="border flex flex-row">
					<input
						type="text"
						placeholder="Search HWPID..."
						list="search-hints"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						style={{
							width: '300px',
							padding: '10px',
							fontSize: '16px',
						}}
					/>
					<datalist id="search-hints">
						{Array.from(hwpids).map((hwpid) => (
							<option value={hwpid} />
						))}
					</datalist>
					<div className="flex flex-col justify-center items-center">
						<button
							className="px-3 cursor-pointer"
							onClick={() => setSearch(searchValue)}
						>
							<FaSearch size={23} />
						</button>
					</div>
				</div>
			</div>
			<p>Total: {products.length} products</p>
			<div className="flex flex-col p-5 gap-5 mt-10">
				{filteredProducts.map((p) => {
					const manufacturer = manufacturers.find(
						(m) => m.manufacturerID === p.manufacturerID,
					);
					return (
						<div className="flex flex-row gap-10">
							<div className="w-52 h-52">
								<img src={p.picture} alt={p.name} />
							</div>
							<div>
								<table>
									<tr>
										<td>Name</td>
										<td>{p.name}</td>
									</tr>
									<tr>
										<td>HWPID</td>
										<td>{p.hwpid}</td>
									</tr>
									<tr>
										<td>Manufacturer</td>
										<td>
											{manufacturer?.name ?? 'N/A'} (ID: {p.manufacturerID})
										</td>
									</tr>
									<tr>
										<td>RF MODE</td>
										<td>{p.rfMode}</td>
									</tr>
									<tr>
										<td>
											<a
												href={p.homePage}
												className="text-blue-600 underline cursor-pointer"
												target="_blank"
											>
												Homepage
											</a>
										</td>
									</tr>
									<tr>
										<td>
											<a
												href={
													(devRepo ? DEV_REPO_URL : REPO_URL) +
													`/products/${p.hwpid}`
												}
												className="text-blue-600 underline cursor-pointer"
												target="_blank"
											>
												Repository link
											</a>
										</td>
									</tr>
								</table>
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}

export default App;
