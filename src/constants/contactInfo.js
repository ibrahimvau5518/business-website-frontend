export const CONTACT_INFO = {
  email: 'shohidbai00@gmail.com',
  phones: ['01605800138', '01605796296'],
  bkashNumbers: ['01605800138', '01605796296'],
  address: {
    line1: 'Stand Road, Banglabazar',
    line2: 'Shadorghat, Chattogram',
  },
};

export const formatAddress = () =>
  `${CONTACT_INFO.address.line1}, ${CONTACT_INFO.address.line2}`;