host = ENV['HOST'] || 'http://localhost:3000'

# Omniauth will first try to use Google, and fall back to Okta if no 
# GOOGLE_CLIENT_ID is defined.  If neither GOOGLE_CLIENT_ID nor
# OKTA_CLIENT_ID is defined, the app will fail to boot
#
Rails.application.config.middleware.use OmniAuth::Builder do
  if ENV['GOOGLE_CLIENT_ID']
    # Default usage, this will give you offline access and a refresh token
    # using default scopes 'email' and 'profile'

    redirect_uri = "#{host}/auth/google_oauth2/callback"

    options = {
      scope:        'email,profile,calendar',
      redirect_uri: redirect_uri,
      setup: ->(env) do
        env['omniauth.strategy'].options['token_params'] = {
          redirect_uri: redirect_uri
        }
      end
    }

    if domain = ENV['OAUTH_DOMAIN']
      options.merge!(hd: domain)
    end

    provider :google_oauth2, ENV.fetch('GOOGLE_CLIENT_ID'), ENV.fetch('GOOGLE_CLIENT_SECRET'), options
  elsif ENV['SAML_ISSUER']
    provider :saml,
    :issuer                             => ENV['SAML_ISSUER'],
    :idp_sso_target_url                 => ENV['SAML_IDP_SSO_TARGET_URL'],
    :idp_cert                           => ENV['SAML_IDP_CERT']
  else
    raise 'Please configure either Google or SAML Authentication.'
  end
end

OmniAuth.config.full_host = host
