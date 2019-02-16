import { Context } from 'probot';

interface Payload {
  installation: {
    account: {
      login: string;
    };
  };
  repositories: { name: string }[];
}

export async function created(context: Context): Promise<void> {
  const { installation, repositories }: Payload = context.payload;
  const owner = installation.account.login;

  repositories.forEach(async repository => {
    const repo = repository.name;
    const branch = 'gql-doctor-config';
    const bot = { name: 'gql-doctor-bot', email: 'sandiiarov@gmail.com' };

    const master = await context.github.gitdata.getRef({
      owner,
      repo,
      ref: 'heads/master',
    });

    await context.github.gitdata.createRef({
      owner,
      repo,
      ref: `refs/heads/${branch}`,
      sha: master.data.object.sha,
    });

    await context.github.repos.createFile({
      owner,
      repo,
      path: 'gql-doctor.json',
      message: 'Add gql-doctor.json',
      content:
        'ewogICJzZXJ2aWNlcyI6IFsKICAgIHsKICAgICAgIm5hbWUiOiAidXNlciIsCiAgICAgICJvd25lciI6ICJncWwtZG9jdG9yIiwKICAgICAgInJlcG8iOiAiZXhhbXBsZSIsCiAgICAgICJyZWYiOiAibWFzdGVyIiwKICAgICAgInBhdGgiOiAidXNlci5ncmFwaHFsIgogICAgfSwKICAgIHsKICAgICAgIm5hbWUiOiAicG9zdCIsCiAgICAgICJvd25lciI6ICJncWwtZG9jdG9yIiwKICAgICAgInJlcG8iOiAiZXhhbXBsZSIsCiAgICAgICJyZWYiOiAibWFzdGVyIiwKICAgICAgInBhdGgiOiAicG9zdC5ncmFwaHFsIgogICAgfQogIF0sCiAgImxpbmtUeXBlRGVmcyI6IHsKICAgICJvd25lciI6ICJncWwtZG9jdG9yIiwKICAgICJyZXBvIjogImV4YW1wbGUiLAogICAgInJlZiI6ICJtYXN0ZXIiLAogICAgInBhdGgiOiAibGlua1R5cGVEZWZzLmdyYXBocWwiCiAgfQp9',
      branch: name,
      committer: bot,
      author: bot,
    });
  });
}
