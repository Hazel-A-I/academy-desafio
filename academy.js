const fs = require("fs");
const csv = require("csv-parser");

const candidates = [];

// Ler o arquivo CSV com o FS do node
fs.createReadStream("./Academy_Candidates.csv")
	.pipe(csv({ separator: ";" }))
	.on("data", (row) => {
		candidates.push({
			Nome: row.Nome,
			Vaga: row.Vaga,
			Idade: parseInt(row.Idade),
			Estado: row.Estado,
		});
	})
	.on("end", () => {
		// Calcular e mostrar resultados nos candidatos
		showResults(candidates);

		// Criar arquivo
		createSortedCsv(candidates, "./Sorted_Academy_Candidates.csv");
	})
	.on("error", (err) => {
		console.error("Erro ao ler o arquivo CSV:", err);
	});

// Checa se é um número quadrado (pelo q entendi)
function isPerfectSquare(num) {
	return num > 0 && Math.sqrt(num) % 1 === 0;
}

// Checa se o nome é palíndromo
function isPalindrome(str) {
	const cleanStr = str.toLowerCase();
	return cleanStr.split("").reverse().join("");
}

// Mostrar resultados
function showResults(candidates) {
	const totalCandidates = candidates.length;

	// Calcula proporção de candidatos por vaga
	const candidatesPerJob = candidates.reduce((accumulator, candidate) => {
		accumulator[candidate.Vaga] = (accumulator[candidate.Vaga] || 0) + 1;
		return accumulator;
	}, {});

	console.log("Proporção de candidatos por vaga:\n");
	Object.keys(candidatesPerJob).forEach((vaga) => {
		const count = candidatesPerJob[vaga];
		const percentage = (count / totalCandidates) * 100;
		console.log(
			`Vaga: ${vaga}, Quantidade por vaga: ${count}, Porcentagem: ${percentage.toFixed(
				2,
			)}%`,
		);
	});

	// Calcula idade média dos candidatos de QA
	const candidatesQA = candidates.filter((c) => c.Vaga === "QA");
	const avgAgeQA =
		candidatesQA.reduce((sum, c) => sum + c.Idade, 0) / candidatesQA.length;
	console.log(
		`\nIdade média dos candidatos de QA: ${avgAgeQA.toFixed(0)} anos`,
	);

	// Achar a idade do candidato de mobile mais velho.
	const oldestMobile = Math.max(
		...candidates.filter((c) => c.Vaga === "Mobile").map((c) => c.Idade),
	);
	console.log(
		`\nIdade do candidato de mobile mais velho: ${oldestMobile} anos`,
	);

	// Achar a idade do candidato de web mais novo.
	const youngestWeb = Math.min(
		...candidates.filter((c) => c.Vaga === "Web").map((c) => c.Idade),
	);
	console.log(`\nIdade do candidato mais novo de Web.: ${youngestWeb} anos`);

	// Soma das idades dos candidatos? ué kk é pelo cálculo? pra ver quem faz?
	const sumAgesQA = candidatesQA.reduce((sum, c) => sum + c.Idade, 0);
	console.log(
		`\nSoma das idades dos candidatos de QA: ${sumAgesQA} anos somados`,
	);

	// Número de estados distintos
	const distinctStates = [...new Set(candidates.map((c) => c.Estado))].length;
	console.log(
		`\nNúmero de estados distintos presentes entre os candidatos: ${distinctStates} estados`,
	);

	// O nome do instrutor de QA descoberto. (eu acho q o quadrado perfeito seria sobre ser o resultado da raiz quadrada, que entre 18 e 30 é 25, do quadrado de 5, vamos ver né)
	const qaInstructor = candidates.find(
		(c) =>
			c.Vaga === "QA" &&
			c.Estado === "SC" &&
			isPerfectSquare(c.Idade) &&
			isPalindrome(c.Nome),
	);
	if (qaInstructor) {
		console.log(`\nInstrutor de QA: ${qaInstructor.Nome}`);
	} else {
		console.log(`\nInstrutor de QA não encontrado`);
	}

	// O nome do instrutor de Mobile descoberto.
	const mobileInstructor = candidates.find(
		(c) =>
			c.Vaga === "Mobile" &&
			c.Estado === "PI" &&
			c.Idade % 2 === 0 &&
			c.Idade >= 30 &&
			c.Idade <= 40 &&
			c.Nome.startsWith("C"),
	);
	if (mobileInstructor) {
		console.log(`\nInstrutor de mobile: ${mobileInstructor.Nome}`);
	} else {
		console.log(`\nInstrutor de mobile não encontrado`);
	}
}

// Criar um arquivo chamado `Sorted_Academy_Candidates.csv` contendo os candidatos ordenados. O critério de ordenação fica a seu critério (por exemplo, por nome ou idade).
function createSortedCsv(candidates, filePath) {
	const sortedCandidates = candidates.sort((a, b) =>
		a.Nome.localeCompare(b.Nome),
	);

	const headers = "Nome;Vaga;Idade;Estado\n";
	const csvData = sortedCandidates
		.map((c) => `${c.Nome},${c.Vaga},${c.Idade},${c.Estado}`)
		.join("\n");

	fs.writeFileSync(filePath, headers + csvData);
	console.log(`\nArquivo CSV criado em: ${filePath}`);
}
