import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <>
            <footer className="footer">
                <div className="footer-content justify-center lg:justify-end">
                    <div className='flex flex-col gap-2 lg:flex-row lg:items-end lg:w-[60%] lg:justify-between lg:pr-[75px]'>
                        <div className='flex flex-col items-center'>
                            <a
                                className="footer-link"
                                target="_blank"
                                href="https://www.linkedin.com/company/kodaze/posts/?feedView=all"
                            >
                                <FontAwesomeIcon className="linkedin-icon" icon={faLinkedin} />
                            </a>
                            <p>Layihə hal-hazırda beta versiyadadır.</p>
                            <p className="copyright">
                                &copy; Müəllif hüquqları qorunur{" "}
                                <a
                                    target="_blank"
                                    className="copyright-link"
                                    href="https://kodaze.com/"
                                >
                                    Kodaze
                                </a>
                            </p>
                        </div>
                        <p><a href="https://openai.com/" target='_blank'>Open AI </a>tərəfindən dəstəklənir.</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
