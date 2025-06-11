export default function Footer() {
	return (
		<footer className="my-8 text-sm text-zinc-500">
			<div className="mb-4 flex flex-wrap gap-2">
				<p>
					Basato su <TextLink website="https://github.com/slowlydev/f1-dash">F1-Dash</TextLink> di <TextLink website="https://slowly.dev">Slowly</TextLink>.
				</p>
			</div>

			<p>
			Questo progetto/sito web è non ufficiale e non è in alcun modo affiliato alle società di Formula 1. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD CHAMPIONSHIP, GRAND PRIX e i marchi correlati sono marchi registrati di Formula One Licensing B.V.
			</p>
		</footer>
	);
}

type TextLinkProps = {
	website: string;
	children: string;
};

const TextLink = ({ website, children }: TextLinkProps) => {
	return (
		<a className="text-blue-500" target="_blank" href={website}>
			{children}
		</a>
	);
};
