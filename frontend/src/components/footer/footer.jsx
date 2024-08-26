import React from "react";
import "../../css/footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <footer className="text-center text-lg-start bg-body-tertiary text-muted pt-2">
        <section className="">
          <div className="container text-center text-md-start">
            <div className="row mt-3">
              <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
                <h6 className="mb-4 footer-title">
                 Try It Out
                </h6>
                <p className="footer-sub-headings">
                  We Sell Everything you'll ever need
                </p>
                <p className="footer-sub-headings">
                © 2021 Copyright: TryItOut
                </p>

              </div>

              <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className=" mb-4 footer-title">Customer</h6>
                <p>
                  <Link
                    className="text-reset footer-sub-headings"
                    to="/customer-login"
                  >
                    Customer Login
                  </Link>

                </p>
                <p>
                <Link
                    className="text-reset footer-sub-headings"
                    to="/customer-register-page"
                  >
                    Customer Registration
                  </Link>
                </p>
              </div>

              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">
                <h6 className="mb-4 footer-title">Admin</h6>
                <p>
                <Link
                    className="text-reset footer-sub-headings"
                    to="/admin-login"
                  >
                    Admin Login
                  </Link>
                </p>
              </div>

              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                <h6 className="mb-4 footer-title">Seller Business</h6>
                <p>
                <Link
                    className="text-reset footer-sub-headings"
                    to="/login"
                  >
                    Seller Login
                  </Link>
                </p>
                <p>
                <Link
                    className="text-reset footer-sub-headings"
                    to="/register"
                  >
                    Sell With Us
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </footer>
    </>
  );
};

export default Footer;
