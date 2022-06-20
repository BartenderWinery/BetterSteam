using Microsoft.Win32;
using System;

namespace Personalize_Steam{
    class socket{
        static void Main(){
            string[] args = Environment.GetCommandLineArgs();

            //args[0] is always the path to the application

            RegistryKey key = Registry.ClassesRoot.OpenSubKey("myApp");  //open myApp protocol's subkey
            if (key == null)
            {  //if the protocol is not registered yet...we register it
                key = Registry.ClassesRoot.CreateSubKey("myApp");
                key.SetValue(string.Empty, "URL: myApp Protocol");
                key.SetValue("URL Protocol", string.Empty);

                key = key.CreateSubKey(@"shell\open\command");
                key.SetValue(string.Empty, args[0] + " " + "%1");
            }
            //%1 represents the argument - this tells windows to open this program with an argument / parameter
            key.Close();

            //^the method posted before, that edits registry      

            //if there's an argument passed, write it
            try {Console.WriteLine("Argument: " + args[1].Replace("myapp:", string.Empty));} 
            //if there's an exception, there's no argument
            catch{Console.WriteLine("No argument(s)");}
            
            Console.ReadLine();}}} //pauses the program - so you can see the result

