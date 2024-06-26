// We trust all links we're sending to, so keep referrers for tracking
/* eslint-disable react/jsx-no-target-blank */

import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect, useContext } from 'react';
import {
  PasskeyWithMetadata,
  useMfaEnrollment,
  usePrivy,
  useWallets,
  WalletWithMetadata,
} from '@privy-io/react-auth';
import Head from 'next/head';
import Loading from '../components/loading';
import AuthLinker from '../components/auth-linker';
import { clearDatadogUser } from '../lib/datadog';
import { DismissableInfo, DismissableError, DismissableSuccess } from '../components/toast';
import { formatWallet } from '../lib/utils';
import { Header } from '../components/header';
import CanvasContainer from '../components/canvas-container';
import CanvasSidebar from '../components/canvas-sidebar';
import CanvasCard from '../components/canvas-card';
import CanvasSidebarHeader from '../components/canvas-sidebar-header';
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpOnSquareIcon,
  ArrowsUpDownIcon,
  CommandLineIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  PencilIcon,
  PlusIcon,
  UserCircleIcon,
  WalletIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  KeyIcon,
  MinusSmallIcon,
} from '@heroicons/react/24/outline';
import Canvas from '../components/canvas';
import CanvasRow from '../components/canvas-row';
import CanvasCardHeader from '../components/canvas-card-header';
import PrivyConfigContext, {
  defaultDashboardConfig,
  defaultIndexConfig,
  PRIVY_STORAGE_KEY,
} from '../lib/hooks/usePrivyConfig';
import Image from 'next/image';
import PrivyBlobIcon from '../components/icons/outline/privy-blob';
import GitHubIcon from '../components/icons/social/github';
import AppleIcon from '../components/icons/social/apple';
import TikTokIcon from '../components/icons/social/tiktok';
import TwitterXIcon from '../components/icons/social/twitter-x';
import FramesCard from '../components/frames-card';
import FarcasterIcon from '../components/icons/social/farcaster';
import { isMobile } from 'react-device-detect';
import Signer from './Signer';
import { useShield3Context } from '@shield3/react-sdk';

export default function DashboardPage() {
  const router = useRouter();
  const [signLoading, setSignLoading] = useState(false);
  const [signSuccess, setSignSuccess] = useState(false);
  const [signError, setSignError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeWallet, setActiveWallet] = useState<WalletWithMetadata | null>(null);
  const [activeApiKey, setActiveApiKey] = useState<string | null>(null);


  const { setConfig } = useContext(PrivyConfigContext);
  const { showMfaEnrollmentModal } = useMfaEnrollment();

  // set initial config, first checking for stored config, then falling back to default
  useEffect(() => {
    const storedConfigRaw = window.localStorage.getItem(PRIVY_STORAGE_KEY);
    const storedConfig = storedConfigRaw ? JSON.parse(storedConfigRaw) : null;
    setConfig?.({
      ...defaultDashboardConfig,
      appearance: storedConfig?.appearance
        ? storedConfig.appearance
        : defaultIndexConfig.appearance,
      embeddedWallets: {
        ...defaultIndexConfig.embeddedWallets,
        requireUserPasswordOnCreate:
          storedConfig?.embeddedWallets?.requireUserPasswordOnCreate ??
          defaultIndexConfig.embeddedWallets!.requireUserPasswordOnCreate,
      },
    });
    if (process.env.NEXT_PUBLIC_SHIELD3_API_KEY) {
      setActiveApiKey(process.env.NEXT_PUBLIC_SHIELD3_API_KEY);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    linkPasskey,
    unlinkPasskey,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
    linkGithub,
    unlinkGithub,
    linkApple,
    unlinkApple,
    linkLinkedIn,
    unlinkLinkedIn,
    linkTiktok,
    unlinkTiktok,
    linkFarcaster,
    unlinkFarcaster,
    getAccessToken,
    createWallet,
    exportWallet,
    unlinkWallet,
    setWalletPassword,
    setActiveWallet: sdkSetActiveWallet,
  } = usePrivy();

  const { wallets: connectedWallets } = useWallets();
  const mfaEnabled = user?.mfaMethods.length ?? 0 > 0;

    const { shield3Client } = useShield3Context()
    
    const handleUpdateApiKey = (apiKey: string) => {
        setActiveApiKey(apiKey)
        shield3Client.setApiKey(apiKey)
    }

  useEffect(() => {
    if (ready && !authenticated) {
      clearDatadogUser();
      router.push('/');
    }
  }, [ready, authenticated, router]);

  const linkedAccounts = user?.linkedAccounts || [];
  const wallets = linkedAccounts.filter((a) => a.type === 'wallet') as WalletWithMetadata[];
  const hasSetPassword = wallets.some(
    (w) => w.walletClientType === 'privy' && w.recoveryMethod === 'user-passcode',
  );

  const linkedAndConnectedWallets = wallets
    .filter((w) => connectedWallets.some((cw) => cw.address === w.address))
    .sort((a, b) => b.verifiedAt.toLocaleString().localeCompare(a.verifiedAt.toLocaleString()));

  useEffect(() => {
    // if no active wallet is set, set it to the first one if available
    if (!activeWallet && linkedAndConnectedWallets.length > 0) {
      setActiveWallet(linkedAndConnectedWallets[0]!);
    }
    // if an active wallet was removed from wallets, clear it out
    if (!linkedAndConnectedWallets.some((w) => w.address === activeWallet?.address)) {
      setActiveWallet(linkedAndConnectedWallets.length > 0 ? linkedAndConnectedWallets[0]! : null);
    }
  }, [activeWallet, linkedAndConnectedWallets]);

  const embeddedWallet = wallets.filter((wallet) => wallet.walletClient === 'privy')?.[0];

  const numAccounts = linkedAccounts.length || 0;
  const canRemoveAccount = numAccounts > 1;


  const emailAddress = user?.email?.address;
  const phoneNumber = user?.phone?.number;

  const googleSubject = user?.google?.subject;
  const googleName = user?.google?.name;

  const twitterSubject = user?.twitter?.subject;
  const twitterUsername = user?.twitter?.username;

  const discordSubject = user?.discord?.subject;
  const discordUsername = user?.discord?.username;

  const githubSubject = user?.github?.subject;
  const githubUsername = user?.github?.username;

  const linkedinSubject = user?.linkedin?.subject;
  const linkedinName = user?.linkedin?.name;

  const appleSubject = user?.apple?.subject;
  const appleEmail = user?.apple?.email;

  const tiktokSubject = user?.tiktok?.subject;
  const tiktokUsername = user?.tiktok?.username;

  const farcasterSubject = user?.farcaster?.fid;
  const farcasterName = user?.farcaster?.username;

  if (!ready || !authenticated || !user) {
    return <Loading />;
  }

  async function deleteUser() {
    const authToken = await getAccessToken();
    try {
      await axios.delete('/api/users/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    } catch (error) {
      console.error(error);
    }
    logout();
  }

  // Remove unknown walletClients.
  // `user` has to be `any` type because by default walletClient is required.
  const removeUnknownWalletClients = (user: any) => {
    user.linkedAccounts.forEach(function (linkedAccount: any, index: number) {
      if (linkedAccount.type === 'wallet' && linkedAccount.walletClient === 'unknown') {
        delete user.linkedAccounts[index].walletClient;
      }
    });
    if (user.wallet?.walletClient === 'unknown') {
      delete user.wallet.walletClient;
    }
    return user;
  };

  return (
    <>
      <Head>
        <title>Shield3 with Privy Demo</title>
      </Head>

      <div className="flex h-full flex-col px-6 pb-6">
        <Header />
        <CanvasContainer className="flex-col-reverse">

          <CanvasSidebar className="md:px-6 md:pb-6">
            <CanvasSidebarHeader className="hidden md:flex">
              <CommandLineIcon className="h-5 w-5" strokeWidth={2} />
              <div className="w-full">Console</div>
            </CanvasSidebarHeader>
            <div className="hidden py-4 md:block md:h-full">
              <textarea
                value={JSON.stringify(removeUnknownWalletClients(user), null, 2)}
                className="no-scrollbar h-full w-full resize-none rounded-lg border-0 bg-privy-color-background-2 p-4 font-mono text-xs text-privy-color-foreground-2"
                disabled
              />
            </div>
            <div className="hidden shrink-0 grow-0 pb-4 text-sm text-privy-color-foreground-3 md:block">
              Privy gives you modular components so you can customize your product for your users.
              Learn more in{' '}
              <a href="https://docs.privy.io/guide/frontend/users/object" target="_blank">
                our docs
              </a>
              .
            </div>
            <CanvasCard className="mb-8 shrink-0 grow-0 md:mb-0 md:!shadow-none">
              <div className="pb-4 text-sm text-privy-color-foreground-3">
                Sign out or delete your data to restart the demo and customize your theme.
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                  }}
                  className="button h-8 gap-x-1 px-3 text-sm"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" strokeWidth={2} />
                  Sign out
                </button>
                <button
                  onClick={async () => {
                    setIsDeleting(true);
                    await deleteUser();
                    setIsDeleting(true);
                  }}
                  className="button h-8 gap-x-2 px-3 text-sm !text-red-400"
                >
                  {!isDeleting ? 'Delete Account' : 'Deleting account...'}
                </button>
              </div>
            </CanvasCard>
          </CanvasSidebar>
          <Canvas className="gap-x-8">

            <CanvasRow>
              {isMobile && <FramesCard />}

              <CanvasCard>
                <CanvasCardHeader>
                  <div className="h-5 w-5 mr-1">
                    <svg width="20" height="20" viewBox="0 0 481 483" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Shield3 Image</title>
                      <path d="M0.0425779 72.0683C-0.00757237 65.185 4.6323 59.1732 11.2609 57.4532L232.672 0V143.391H123.842C117.624 143.391 112.584 148.459 112.584 154.711V192.445C112.584 198.697 117.624 203.766 123.842 203.766H232.672V483C141.277 455.896 85.0503 404.458 50.8349 339.609H131.347C137.565 339.609 142.606 334.541 142.606 328.289V290.555C142.606 284.303 137.565 279.234 131.347 279.234H26.0369C6.18469 215.65 0.567133 144.065 0.0425779 72.0683Z" fill="#F4E065" />
                      <path d="M480.312 72.0693C480.362 65.186 475.722 59.1732 469.094 57.4532L247.682 0V143.391H356.512C362.73 143.391 367.771 148.459 367.771 154.711V192.445C367.771 198.697 362.73 203.766 356.512 203.766H247.682V279.234H356.512C362.73 279.234 367.771 284.303 367.771 290.555V328.289C367.771 334.541 362.73 339.609 356.512 339.609H247.682V483C446.888 423.925 479.021 249.241 480.312 72.0693Z" fill="#D5AE56" />
                    </svg>
                  </div>
                  Get Shield3 Policy Results
                </CanvasCardHeader>
                <div className="flex shrink-0 grow-0 flex-row items-center justify-start gap-x-1 text-privy-color-foreground-3">
                  {`Address: ${user.wallet ? formatWallet(user.wallet.address) : 'wallet not connected'}`}
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <Signer />
                </div>
              </CanvasCard>
              <CanvasCard>
                <CanvasCardHeader>
                  <div className="h-5 w-5 mr-1">
                    <svg width="20" height="20" viewBox="0 0 481 483" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <title>Shield3 Image</title>
                      <path d="M0.0425779 72.0683C-0.00757237 65.185 4.6323 59.1732 11.2609 57.4532L232.672 0V143.391H123.842C117.624 143.391 112.584 148.459 112.584 154.711V192.445C112.584 198.697 117.624 203.766 123.842 203.766H232.672V483C141.277 455.896 85.0503 404.458 50.8349 339.609H131.347C137.565 339.609 142.606 334.541 142.606 328.289V290.555C142.606 284.303 137.565 279.234 131.347 279.234H26.0369C6.18469 215.65 0.567133 144.065 0.0425779 72.0683Z" fill="#F4E065" />
                      <path d="M480.312 72.0693C480.362 65.186 475.722 59.1732 469.094 57.4532L247.682 0V143.391H356.512C362.73 143.391 367.771 148.459 367.771 154.711V192.445C367.771 198.697 362.73 203.766 356.512 203.766H247.682V279.234H356.512C362.73 279.234 367.771 284.303 367.771 290.555V328.289C367.771 334.541 362.73 339.609 356.512 339.609H247.682V483C446.888 423.925 479.021 249.241 480.312 72.0693Z" fill="#D5AE56" />
                    </svg>
                  </div>
                  Set Shield3 API Key
                </CanvasCardHeader>
                <div className="flex flex-col gap-2 pt-4">
                  <input
                    type="text"
                    value={activeApiKey || ''}
                    onChange={(e) => handleUpdateApiKey(e.target.value)}
                    className="no-scrollbar h-10 w-full resize-none rounded-lg border border-privy-color-foreground-2 p-2 font-mono text-sm text-privy-color-foreground-2"
                    placeholder="Enter API Key"
                  />
                </div>
              </CanvasCard>
              <CanvasCard>
                <CanvasCardHeader>
                  <WalletIcon className="h-5 w-5" strokeWidth={2} />
                  Wallets
                </CanvasCardHeader>
                <div className="pb-1 text-sm text-privy-color-foreground-3">
                  Connect and link wallets to your account.
                </div>
                <div className="flex flex-col gap-2">
                  {wallets.map((wallet) => {
                    return (
                      <AuthLinker
                        isLinked
                        wallet={wallet}
                        isActive={wallet.address === activeWallet?.address}
                        setActiveWallet={setActiveWallet}
                        key={wallet.address}
                        label={formatWallet(wallet.address)}
                        canUnlink={canRemoveAccount}
                        unlinkAction={() => {
                          unlinkWallet(wallet.address);
                        }}
                        walletConnectorName={
                          connectedWallets.find((cw) => cw.address === wallet.address)
                            ?.walletClientType
                        }
                        linkAction={linkWallet}
                        isConnected={connectedWallets.some((cw) => cw.address === wallet.address)}
                        connectAction={sdkSetActiveWallet}
                      />
                    );
                  })}
                  <button className="button h-10 gap-x-1 px-4 text-sm" onClick={linkWallet}>
                    <PlusIcon className="h-4 w-4" strokeWidth={2} />
                    Link a Wallet
                  </button>
                </div>
              </CanvasCard>

              <CanvasCard>
                <CanvasCardHeader>
                  <KeyIcon className="h-5 w-5" strokeWidth={2} />
                  Passkeys
                </CanvasCardHeader>
                <div className="pb-1 text-sm text-privy-color-foreground-3">
                  Link a passkey to your account
                </div>
                <div className="flex flex-col gap-2">
                  {user.linkedAccounts
                    .filter((account): account is PasskeyWithMetadata => account.type === 'passkey')
                    .map((account) => (
                      <button
                        onClick={() => unlinkPasskey(account.credentialId)}
                        key={account.credentialId}
                        className="button h-10 gap-x-1 px-4 text-sm"
                      >
                        <MinusSmallIcon className="h-4 w-4" strokeWidth={2} />
                        Unlink{' '}
                        {account.authenticatorName ??
                          `${account.createdWithBrowser} on ${account.createdWithOs}`}
                      </button>
                    ))}
                  <button className="button h-10 gap-x-1 px-4 text-sm" onClick={linkPasskey}>
                    <PlusIcon className="h-4 w-4" strokeWidth={2} />
                    Link a passkey
                  </button>
                </div>
              </CanvasCard>

              <CanvasCard>
                <CanvasCardHeader>
                  <ArrowsUpDownIcon className="h-5 w-5" strokeWidth={2} />
                  Wallet Actions
                </CanvasCardHeader>
                <div className="text-sm text-privy-color-foreground-3">
                  Whether they came in with Metamask or an embedded wallet, a user is a user.
                  Trigger wallet actions below.
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    type='button'
                    className="button h-10 gap-x-1 px-4 text-sm"
                    disabled={signLoading || !wallets.length || !activeWallet}
                    onClick={() => {
                      setSignError(false);
                      setSignSuccess(false);
                      setSignLoading(true);
                      connectedWallets
                        .find((wallet) => wallet.address === activeWallet?.address)
                        ?.sign('Signing with the active wallet in Privy: ' + activeWallet?.address)
                        .then(() => {
                          setSignSuccess(true);
                          setSignLoading(false);
                        })
                        .catch(() => {
                          setSignError(true);
                          setSignLoading(false);
                        });
                    }}
                  >
                    <PencilIcon className="h-4 w-4" strokeWidth={2} />
                    Sign a Message
                  </button>
                  {signSuccess && (
                    <DismissableSuccess
                      message="Success!"
                      clickHandler={() => setSignSuccess(false)}
                    />
                  )}
                  {signError && (
                    <DismissableError
                      message="Signature failed"
                      clickHandler={() => setSignError(false)}
                    />
                  )}
                  {signLoading && <DismissableInfo message="Waiting for signature" />}
                </div>
              </CanvasCard>
              {embeddedWallet ? (
                <CanvasCard>
                  <CanvasCardHeader>
                    <PrivyBlobIcon className="h-5 w-5 shrink-0 grow-0" strokeWidth={2} />
                    <div className="w-full">Embedded Wallet</div>
                    <div className="flex shrink-0 grow-0 flex-row items-center justify-end gap-x-1 text-privy-color-foreground-3">
                      {formatWallet(embeddedWallet.address)}
                    </div>
                  </CanvasCardHeader>
                  <div className="text-sm text-privy-color-foreground-3">
                    A user&apos;s embedded wallet is theirs to keep, and even take with them.
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    {!hasSetPassword && (
                      <button
                        type='button'
                        className="button h-10 gap-x-1 px-4 text-sm"
                        disabled={!(ready && authenticated)}
                        onClick={setWalletPassword}
                      >
                        <ShieldCheckIcon className="h-4 w-4" strokeWidth={2} />
                        Set a recovery password
                      </button>
                    )}
                    <button
                      type='button'
                      className="button h-10 gap-x-1 px-4 text-sm"
                      disabled={!(ready && authenticated)}
                      onClick={exportWallet}
                    >
                      <ArrowUpOnSquareIcon className="h-4 w-4" strokeWidth={2} />
                      Export Embedded wallet
                    </button>
                  </div>
                </CanvasCard>
              ) : (
                // If they don't have an Embedded Wallet
                <CanvasCard>
                  <CanvasCardHeader>
                    <PrivyBlobIcon className="h-5 w-5 shrink-0 grow-0" strokeWidth={2} />
                    Embedded Wallet
                  </CanvasCardHeader>
                  <div className="text-sm text-privy-color-foreground-3">
                    With Privy, even non web3 natives can enjoy the benefits of life on chain.
                  </div>
                  <div className="flex flex-col gap-2 pt-4">
                    <button
                      className="button h-10 gap-x-1 px-4 text-sm"
                      disabled={!(ready && authenticated)}
                      onClick={() => {
                        createWallet();
                      }}
                    >
                      <PlusIcon className="h-4 w-4" strokeWidth={2} />
                      Create an Embedded Wallet
                    </button>
                  </div>
                </CanvasCard>
              )}
            </CanvasRow>

            <CanvasRow>
              <CanvasCard>
                <CanvasCardHeader>
                  <UserCircleIcon className="h-5 w-5" strokeWidth={2} />
                  Linked Socials
                </CanvasCardHeader>
                <div className="flex flex-col gap-2">
                  <AuthLinker
                    socialIcon={
                      <EnvelopeIcon
                        className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0"
                        strokeWidth={2}
                      />
                    }
                    label="Email"
                    linkedLabel={`${emailAddress}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!emailAddress}
                    unlinkAction={() => {
                      unlinkEmail(emailAddress as string);
                    }}
                    linkAction={linkEmail}
                  />

                  <AuthLinker
                    socialIcon={
                      <DevicePhoneMobileIcon
                        className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0"
                        strokeWidth={2}
                      />
                    }
                    label="Phone"
                    linkedLabel={`${phoneNumber}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!phoneNumber}
                    unlinkAction={() => {
                      unlinkPhone(phoneNumber as string);
                    }}
                    linkAction={linkPhone}
                  />

                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0">
                        <Image
                          src="/social-icons/color/google.svg"
                          height={20}
                          width={20}
                          alt="Google"
                        />
                      </div>
                    }
                    label="Google"
                    linkedLabel={`${googleName}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!googleSubject}
                    unlinkAction={() => {
                      unlinkGoogle(googleSubject as string);
                    }}
                    linkAction={linkGoogle}
                  />

                  <AuthLinker
                    className="hidden md:flex"
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0">
                        <TwitterXIcon height={18} width={18} />
                      </div>
                    }
                    label="Twitter"
                    linkedLabel={`${twitterUsername}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!twitterSubject}
                    unlinkAction={() => {
                      unlinkTwitter(twitterSubject as string);
                    }}
                    linkAction={linkTwitter}
                  />

                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0">
                        <Image
                          src="/social-icons/color/discord.svg"
                          height={20}
                          width={20}
                          alt="Discord"
                        />
                      </div>
                    }
                    label="Discord"
                    linkedLabel={`${discordUsername}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!discordSubject}
                    unlinkAction={() => {
                      unlinkDiscord(discordSubject as string);
                    }}
                    linkAction={linkDiscord}
                  />

                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0">
                        <GitHubIcon height={18} width={18} />
                      </div>
                    }
                    label="Github"
                    linkedLabel={`${githubUsername}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!githubSubject}
                    unlinkAction={() => {
                      unlinkGithub(githubSubject as string);
                    }}
                    linkAction={linkGithub}
                  />

                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0 text-privy-color-foreground">
                        <AppleIcon height={18} width={18} />
                      </div>
                    }
                    label="Apple"
                    linkedLabel={`${appleEmail}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!appleSubject}
                    unlinkAction={() => {
                      unlinkApple(appleSubject as string);
                    }}
                    linkAction={linkApple}
                  />
                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0">
                        <Image
                          src="/social-icons/color/linkedin.svg"
                          height={20}
                          width={20}
                          alt="LinkedIn"
                        />
                      </div>
                    }
                    label="LinkedIn"
                    linkedLabel={`${linkedinName}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!linkedinSubject}
                    unlinkAction={() => {
                      unlinkLinkedIn(linkedinSubject as string);
                    }}
                    linkAction={linkLinkedIn}
                  />
                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0 text-privy-color-foreground">
                        <TikTokIcon height={18} width={18} />
                      </div>
                    }
                    label="TikTok"
                    linkedLabel={`${tiktokUsername}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!tiktokSubject}
                    unlinkAction={() => {
                      unlinkTiktok(tiktokSubject as string);
                    }}
                    linkAction={linkTiktok}
                  />
                  <AuthLinker
                    socialIcon={
                      <div className="h-[1.125rem] w-[1.125rem] shrink-0 grow-0 text-privy-color-foreground">
                        <FarcasterIcon height={18} width={18} />
                      </div>
                    }
                    label="Farcaster"
                    linkedLabel={`${farcasterName}`}
                    canUnlink={canRemoveAccount}
                    isLinked={!!farcasterSubject}
                    unlinkAction={() => {
                      unlinkFarcaster(farcasterSubject as number);
                    }}
                    linkAction={linkFarcaster}
                  />
                </div>
              </CanvasCard>

              <CanvasCard>
                <CanvasCardHeader>
                  <LockClosedIcon className="h-5 w-5" strokeWidth={2} />
                  <div className="w-full">Transaction MFA</div>
                  <div className="flex shrink-0 grow-0 flex-row items-center justify-end gap-x-1 text-privy-color-foreground-3">
                    {mfaEnabled ? 'Enabled' : 'Disabled'}
                  </div>
                </CanvasCardHeader>
                <div className="text-sm text-privy-color-foreground-3">
                  Add a second factor to sensitive embedded wallet actions to protect your account.
                  Verification lasts for 15 minutes.
                </div>
                <div className="flex flex-col gap-2 pt-4">
                  <button
                    className="button h-10 gap-x-1 px-4 text-sm"
                    disabled={!(ready && authenticated)}
                    onClick={showMfaEnrollmentModal}
                  >
                    {!mfaEnabled ? (
                      <>
                        <PlusIcon className="h-4 w-4" strokeWidth={2} />
                        Add MFA
                      </>
                    ) : (
                      <>
                        <PencilIcon className="h-4 w-4" strokeWidth={2} />
                        Manage MFA
                      </>
                    )}
                  </button>
                </div>
              </CanvasCard>
            </CanvasRow>

            {!isMobile && (
              <CanvasRow>
                <FramesCard />
              </CanvasRow>
            )}
          </Canvas>
        </CanvasContainer>
      </div>
    </>
  );
}
