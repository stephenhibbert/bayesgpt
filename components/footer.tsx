import SocialIcon from './social-icons';

export default function Footer() {
  return (
    <footer>
      <div className="mt-16 flex flex-col items-center">
        <div className="mb-3 flex space-x-4">
          <SocialIcon kind="mail" href={`mailto:stephen@latenttime.com`} />
          <SocialIcon kind="github" href={'https://github.com/stephenhibbert/bayesgpt'} />
          <SocialIcon kind="linkedin" href={'https://www.linkedin.com/in/stephen-hibbert-2b7a045b/'} />
          <SocialIcon kind="x" href={'https://twitter.com/stephenhib'} />
        </div>
        <div className="mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <div>{'Stephen Hibbert'}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <div>{'Latent Time Limited'}</div>
        </div>
      </div>
    </footer>
  )
}
