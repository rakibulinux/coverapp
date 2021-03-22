import backend from "./backend";
import message from "./message";
import modal from "./modal";

export default {
  locale: "en-US",
  name: "English",
  status: {
    error: "Error",
    warning: "Warning",
    success: "Success",
    info: "Info",
  },
  header: {
    exchange: "Exchange",
    sign_in: "Sign In",
    sign_up: "Sign Up",
    my_assets: "My Assets",
    orders: "Orders",
    open_orders: "Open Orders",
    orders_history: "Orders History",
    trades_history: "Trades History",
    user: {
      account_security: "Account Security",
      kyc_account_verification: "KYC Account verification",
      login_history: "Login History",
      api: "API",
      logout: "Logout",
    },
  },
  history: {
    succeed: "success",
    failed: "failure",
    login: "Login",
  },
  input: {
    placeholder: {
      search: "Search",
      email: "Email address",
      password: "Login password",
      confirm_password: "Confirm Password",
      refid: "Referral uid",
      "2fa_code": "2FA Code",
    }
  },
  auth: {
    login: "Log In",
    register: "Sign Up",
    confirm: "Confirm",
    forgot_password: "Forgot Password",
    reset_password: "Reset Password",
    no_account: "No account?",
    to_sign_up: "To sign up!",
    input_error: {
      email: "Incorrect email address. Please enter again.",
      password: "At least 8 characters, must include UPPER CASE letters and numbers.",
      confirm_password: "Passwords do not match. Please try again.",
      refid: "Please enter correct referral ID"
    }
  },
  // Header table
  table: {
    "status": "Status",
    "name": "Name",
    "date": "Date",
    "time": "Time",
    "pair": "Pair",
    "coin": "Coin",
    "currency": "Currency",
    "infomation": "Infomation",
    "last_price": "Last Price",
    "price": "Price",
    "market": "Market",
    "change": "Change",
    "volume": "Volume",
    "sum": "Sum",
    "amount": "Amount",
    "total": "Total",
    "executed": "Executed",
    "unexecuted": "Unexecuted",
    "avg_price": "Average Price",
    "side": "Side",
    "type": "Type",
    "filled": "Filled%",
    "24h_change": "24h Change",
    "24h_high": "24h High",
    "24h_low": "24h Low",
    "24h_amount": "24h Amount",
    "24h_volume": "24h Volume",
    "ip_address": "IP Address",
    "action": "Action",
    "available": "Available",
    "locked": "Locked",
    "btc_val": "BTC Valuation",
    "search": "Search",
    "kid": "Kid",
    "created": "Created",
  },
  action: {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    exchange: "Exchange",
  },
  market_list: {
    favorite: "Favorite",
    market: "{market} Market",
  },
  exchange: {
    card_head: {
      chart: "Chart",
      market_trades: "Market Trades",
      open_orders: "Open Orders",
      orders_history: "Orders History",
      trades_history: "Trades History",
      limit_order: "Limit Order",
      button: {
        cancel_all: "Cancel All"
      }
    },
    status: {
      "change": "Change",
      "high": "High",
      "low": "Low",
      "24h_amount": "24h Amount",
      "24h_volume": "24h Volume",
    },
    "trade-action": {
      price: "PRICE",
      amount: "AMOUNT",
      total: "Total",
      sell: "SELL {currency}",
      buy: "BUY {currency}",
    },
  },
  assets: {
    address: "Address",
    txid: "Txid",
    hidesmall: "Hide Small Balances",
    total_assets_calc: "Estimated Value",
    instructions: "Instructions:",
    deposit: {
      deposit_address: "Deposit address:",
      copy: "Copy",
      qr_code: "QR Code",
      note: `
        • Min. Deposit Amount: {min_deposit_amount} {currency}
        {0}
        • {min_confirmations} network confirmations are required to deposit, send only {currency} to this address.Sending any other currency to this address may result in the loss of your deposit.
        {0}
        • Please make sure that your computer and browser are secure and your information is protected from being tampered or leaked.
      `,
    },
    withdraw: {
      amount: "Amount",
      available: "Available:",
      fee: "Fee",
      receive_amount: "Receive Amount",
      note: `
        • Minimum withdrawal amount: {min_withdraw_amount} {currency}.
        {0}
        • To ensure the safety of your funds, your withdrawal request will be manually reviewed if your security strategy or password is changed. Please wait for phone calls or emails from our staff.
        {0}
        • Please make sure that your computer and browser are secure and your information is protected from being tampered or leaked.
      `,
      submit: "Withdraw",
    },
    history: {
      state: {
        submitted: "Submitted",
        aml_processing: "Aml Processing",
        aml_suspicious: "Aml Suspicious",
        collected: "Collected",
        fee_processing: "Fee Processing",
        prepared: "Prepared",
        canceled: "Canceled",
        accepted: "Accepted",
        skipped: "Skipped",
        to_reject: "To Reject",
        rejected: "Rejected",
        processing: "Processing",
        succeed: "Succeed",
        failed: "Failed",
        errored: "Errored",
        confirming: "Confirming",
        completed: "Completed",
      },
    },
  },
  orders: {
    open: {
      title: "Open Orders",
      empty: "You don't have any open order",
    },
    history: {
      title: "Order History",
      empty: "You don't have any order",
    },
    transaction: {
      title: "Trade History",
      empty: "You don't have any trade",
    },
    empty_second: "Go to the Trade tab and make your order!",
  },
  usercenter: {
    account_information: {
      title: "Account information",
      rows: {
        email: {
          name: "Email",
          desc:
            "Used to withdraw, retrieve passwords, modify security settings and other operations.",
        },
      },
    },
    account_security: {
      title: "Account Security",
      rows: {
        psw: {
          name: "Login Password",
          desc: `Used for account login.`,
          action: "Change password",
        },
        otp: {
          name: "Google Authenticator",
          desc: `Recommended to be used for withdrawal & password & security settings modifications.`,
          action: "Setting",
        },
      },
    },
    login_history: {
      title: "Login History",
    },
    api: {
      title: "API",
      header: {
        button: "Create new"
      }
    },
  },
  ...backend,
  message,
  modal,
  market: {
    side: {
      buy: "Buy",
      sell: "Sell"
    },
    orders: {
      ord_type: {
        limit: "Limit",
        market: "Market"
      },
      state: {
        wait: "Wait",
        cancel: "Canceled",
        done: "Done",
        reject: "Rejected",
        rejected: "Rejected",
      }
    }
  }
};
