import re
import requests
from app.config import BACKEND_URL


def get_invoice_number(lines):
    invoice_number = ''
    after_word = False
    pattern = re.compile(r'\d+')
    for line in lines:
        if any([kw in line.lower() for kw in ('faktúra', 'faktúra:', 'faktury')]):
            words = line.split()
            for word in words:
                if any([kw in word.lower() for kw in ('faktúra', 'faktúra:', 'faktury')]):
                    after_word = True
                if word.isdigit() and after_word:
                    invoice_number = word
                    return invoice_number
                else:
                    match = pattern.search(word)
                    if match and after_word:
                        invoice_number = match.group()
                        return invoice_number
    return invoice_number


def get_variable_symbol(lines):
    var_symbol = ''
    for line in lines:
        if any([kw in line.lower() for kw in ('variabilný', 'var.symbol', 'vs:', 'v.s.', 'variabilný:')]):
            words = line.split()
            for word in words:
                if word.isdigit():
                    var_symbol = word
                    return var_symbol
    return var_symbol


def get_date_of_issue(lines):
    date_of_issue = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")
    for line in lines:
        if 'd%tum' in line.lower():
            if line.find('vystaven'):
                match = date_pattern.search(line)
            if match:
                date_of_issue = match.group()
                return date_of_issue
        if any([kw in line.lower() for kw in (
                'dátum vystavenia', 'dátum vyhotovenia', 'dátum vyhotovenia:', 'vyhotovená:', 'vystavenia:',
                'vyštavenia')]):
            match = date_pattern.search(line)
            if match:
                date_of_issue = match.group()
                return date_of_issue
    return date_of_issue


def get_due_date(lines):
    due_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")
    for line in lines:
        if any([kw in line.lower() for kw in
                ('dátum splatnosti', 'splatnosť', 'splatnosť:', 'splatnosti:', 'splatností')]):
            match = date_pattern.search(line)
            if match:
                due_date = match.group()
                return due_date
    return due_date


def get_delivery_date(lines):
    delivery_date = ''
    date_pattern = re.compile(r"\d{1,2}\s*[-.:]\s*\d{1,2}\s*[-.:]\s*\d{2,4}")
    for line in lines:
        if any([kw in line.lower() for kw in (
                'dátum dodania', 'dátum uskut.', 'dátum plnenia', 'dodanie', 'dodania', 'dátum daň. povin.',
                'daňová povinnosť')]):
            match = date_pattern.search(line)
            if match:
                delivery_date = match.group()
                return delivery_date
    return delivery_date


def get_payment_method(lines):
    payment_method = ''
    for line in lines:
        if any([kw in line.lower() for kw in (
                'forma úhrady', 'spôsob úhrady', 'forma platby', 'spôsob platby', 'spôs. úhrady', 'úhrada', 'platba')]):
            words = line.split()
            for i, word in enumerate(words):
                if word.lower().rstrip('.:') == 'úhrady' or word.lower().rstrip(
                        '.:') == 'úhrada' or word.lower().rstrip('.:') == 'platby' or word.lower().rstrip(
                    '.:') == 'platba':
                    if any(x in words for x in ['prevod', 'Prevod', 'prevodom', 'Prevodom']):
                        payment_method = 'Bankovým prevodom'
                    elif any(x in words for x in ['hotovosť', 'Hotovosť', 'hotovosťou', 'Hotovosťou', 'hotovosti']):
                        payment_method = 'Hotovosťou'
                    elif any(x in words for x in ['dobierka', 'Dobierka', 'dobierkou', 'Dobierkou']):
                        payment_method = 'Dobierkou'
                    elif ':PP' in words:
                        payment_method = 'PP'
                    else:
                        if i + 1 < len(words) and words[i + 1].isalpha():
                            payment_method = words[i + 1]
                        elif i + 2 < len(words):
                            payment_method = words[i + 2]
                    return payment_method
    return payment_method


def get_total_price(lines):
    total_price = ''
    pattern = re.compile(r"€?\b\d+(?:[,\s]\d+)*\b")
    for line in lines:
        if any([kw1 in line.lower() and kw2 in line.lower() for kw1, kw2 in
                (('celkom', '€'), ('spolu', '€'), ('celkom', 'eur'), ('spolu', 'eur'),
                 ('celková', 'suma'), ('fakturovaná', 'suma'), (
                         'celková', 'hodnota'), ('suma', ' úhradu:'),
                 ('spolu', 'úhradu'), ('fakturovaná', 'hodnota'), (
                         'celkom', 'úhrade'),
                 ('na', 'zaplatenie'))]):
            line = re.sub(r'(\d)\s+(\d)', r'\1\2', line)
            words = line.split()
            for word in words:
                if pattern.match(word):
                    total_price = word
                    return total_price
    return total_price


def get_bank(lines):
    bank = ''
    for line in lines:
        if 'všeobecná' in line.lower() or 'vúb' in line.lower():
            bank = 'Všeobecná úverová banka'
            return bank
        if 'čsob' in line.lower() or 'československá obchodná' in line.lower():
            bank = 'ČSOB'
            return bank
        if 'tatrabanka' in line.lower() or 'tatra' in line.lower():
            bank = 'Tatrabanka'
            return bank
        if 'banka' in line.lower():
            words = line.split()
            last_word_index = len(words) - 1
            for i, word in enumerate(words):
                if word.lower() == 'banka:' and i != last_word_index:
                    bank = words[i + 1]
                    return bank
    return bank


def get_swift(lines):
    swift = ''
    pattern = re.compile(r'^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$')
    for line in lines:
        if any([kw in line.lower() for kw in ('swift', 'swft', 'swiet', 'bic')]):
            words = line.split()
            for word in words:
                if len(word) >= 8:
                    if pattern.match(word):
                        swift = word
                        return swift
                    elif 'swift:' in word.lower():
                        possible_swift = word.split(':')[1]
                        if pattern.match(possible_swift):
                            swift = possible_swift
                            return swift
            for i, word in enumerate(words):
                last_word_index = len(words) - 1
                if word.lower() == 'swift:' and i != last_word_index:
                    swift = words[i + 1]
                    return swift
    return swift


def get_iban(lines):
    iban = ''
    pattern = re.compile(
        r'[a-zA-Z]{2}\s*[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,16}')
    for line in lines:
        if 'iban' in line.lower() or 'účet'.rstrip(':') in line.lower():
            line = re.sub(r'(\d)\s+(\d)', r'\1\2', line)
            match = pattern.search(line)
            if match:
                iban = match.group()
                return iban
    return iban


def get_supplier_ico(lines):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for i, line in enumerate(lines):
        keywords = ('ičo', '1čo:', '1ičo', 'ič:', '1č0', 'ičq')
        count = sum([line.lower().count(kw) for kw in keywords])
        if count >= 2 or (count == 1 and 'odberateľ' not in line.lower()):
            words = line.split()
            for j, word in enumerate(words):
                if pattern.match(word):
                    ico = word.rstrip(',')
                    del word
                    del words[j]
                    lines[i] = ' '.join(words)
                    return ico
    return ico


def get_buyer_ico(lines):
    ico = ''
    pattern = re.compile(r"\b\d{8}\b")
    for i, line in enumerate(lines):
        if any([kw in line.lower() for kw in ('ičo', '1čo:', '1ičo', 'ič:', '1č0', 'ičq')]):
            words = line.split()
            for j, word in enumerate(words):
                if pattern.match(word):
                    ico = word
                    del word
                    del words[j]
                    lines[i] = ' '.join(words)
                    return ico
                if ':' in word:
                    possible_ico = word.split(':')[1]
                    if pattern.match(possible_ico):
                        ico = possible_ico
                        return ico
    return ico


def parse_text(text):
    lines = text.split('\n')
    supplier_data = {}
    buyer_data = {}

    supplier_ico = get_supplier_ico(lines)
    if supplier_ico:
        details_url = f"{BACKEND_URL}/get_details?ico={supplier_ico}"
        supplier_details = requests.post(details_url)

        if supplier_details.status_code == 200:
            supplier_data = supplier_details.json()['data']

    buyer_ico = get_buyer_ico(lines)
    if buyer_ico:
        details_url = f"{BACKEND_URL}/get_details?ico={buyer_ico}"
        buyer_details = requests.post(details_url)

        if buyer_details.status_code == 200:
            buyer_data = buyer_details.json()['data']

    data = {
        'invoice_number': get_invoice_number(lines),
        'var_symbol': get_variable_symbol(lines),
        'date_of_issue': get_date_of_issue(lines),
        'due_date': get_due_date(lines),
        'delivery_date': get_delivery_date(lines),
        'payment_method': get_payment_method(lines),
        'total_price': get_total_price(lines),
        'bank': get_bank(lines),
        'swift': get_swift(lines),
        'iban': get_iban(lines),
        'buyer_ico': buyer_ico,
        'supplier_ico': supplier_ico,
        'supplier_data': supplier_data,
        'buyer_data': buyer_data
    }
    return data
