using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace GB2
{
    class Program
    {
        static void Main(string[] args)
        {
            string countryCode = ConfigurationManager.AppSettings["CountryCode"];
            int startSection = Int32.Parse(ConfigurationManager.AppSettings["StartSection"]);
            int endSection = Int32.Parse(ConfigurationManager.AppSettings["EndSection"]);
            int start = Int32.Parse(ConfigurationManager.AppSettings["StartYear"]);
            int end = Int32.Parse(ConfigurationManager.AppSettings["EndYear"]);
            string downloadFolder = string.Format("C:\\Users\\maqin\\gb2\\downloads\\{0}", countryCode);
            string baseUrl = "http://www.football-data.co.uk/mmz4281/";

            for (int startYear = start; startYear < end; startYear++)
            {
                int endYear = startYear + 1;
                string urlWithYear = baseUrl + (startYear % 100).ToString("d2") + (endYear % 100).ToString("d2");
                for (int section = startSection; section <= endSection; section++)
                {
                    string url = urlWithYear + "/" + countryCode + section.ToString() + ".csv";
                    using (WebClient client = new WebClient())
                    {
                        client.Headers["User-Agent"] =
                            "Mozilla/4.0 (Compatible; Windows NT 5.1; MSIE 6.0) " +
                            "(compatible; MSIE 6.0; Windows NT 5.1; " +
                            ".NET CLR 1.1.4322; .NET CLR 2.0.50727)";

                        string currentFolder = Path.Combine(downloadFolder, startYear.ToString());
                        if (!Directory.Exists(currentFolder))
                        {
                            Directory.CreateDirectory(currentFolder);
                        }

                        string downloadPath = Path.Combine(currentFolder, Path.GetFileName(url));
                        Console.WriteLine("Downloading {0} to {1}...", Path.GetFileName(url), downloadPath);
                        client.DownloadFile(url, downloadPath);
                    }
                }
            }
        }
    }
}
