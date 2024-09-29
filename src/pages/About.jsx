import aboutImg from '../assets/about.png'

const About = () => {
    return (
        <div className="h-screen flex flex-col mt-[41px] px-[10px] pb-[40px] min-h-[900px] md:px-[75px]">
            <img src={aboutImg} alt="" className='block h-[516px] mx-auto w-full object-cover'/>
            <article className='mt-[37px] max-w-[709px]'>
                <h2 className='mb-[10px] text-[1.5em] font-[400]'>Ümumi məlumat</h2>
                <p className='text-[1.1em]'>Bu xidmət Kodaze komandası tərəfindən “Sosial layihə” məqsədi ilə hazırlanmışdır. İstifadəsi ödənişsiz olub, mətnlərdə qrammatik xətaları tapmaq və həll etmək hədəflənmişdir. Xidmət süni intelektə bağlıdır. Nəticə əldə olunandan sonra yoxlanması məsləhət görülür. İstifadəçilərə yararlı olduğu təqdirdə təkmilləşdirilməsi hədəflənmişdir. Ümid edirik ki, xalqımızın işlərini asanlaşdıracaqdır. Əlaqə üçün <a href="mailto:info@kodaze.com">info@kodaze.com</a> - a yazın. </p>
            </article>
        </div>
    )
}

export default About;